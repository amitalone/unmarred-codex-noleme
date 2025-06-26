import * as fs from "fs";
import * as path from "path";
import * as os from "os";
//import sharp from "sharp";

import { ScannedFile } from "@repo/shared-interfaces";
 
import {
  FileMetadata,
  ImageSidecar,
  FileToMove,
  MoveResult,
  FolderStructure,
  TreeViewItem,
  FilterOptions,
  ImagesAndFiltersResult,
  UploadedFile
} from "./interfaces";

// const LOCAL_LOCAL_FS_PATH = "C:/workspace/face-swap-fs/";
// const LOCAL_UPLOAD_IMAGE_FOLDER_BASE = LOCAL_LOCAL_FS_PATH;
// const DAM_URL = "http://192.168.50.38:8000/";
// const RELATIVE_FACES_PATH = "faces/";
// const RELATIVE_MODEL_PATH = "model/";
// const IMPORT_FILE_PATH = "imported-files/";

const SFW_MODE = false;



const readImageSidecarSync = (
  imageFilePath: string
): Pick<ImageSidecar, "filename" | "type" | "status" | "importType"> | null => {
  const imageFileExtension = path.extname(imageFilePath);
  const imageFileNameWithoutExtension = path.basename(imageFilePath, imageFileExtension);
  // Construct JSON file path assuming it's in the same directory with .json extension
  const jsonFilePath = path.join(
    path.dirname(imageFilePath),
    `${imageFileNameWithoutExtension}.json`
  );

  if (fs.existsSync(jsonFilePath)) {
    try {
      const jsonContentString = fs.readFileSync(jsonFilePath, "utf8");
      const jsonData: ImageSidecar = JSON.parse(jsonContentString);
      return {
        filename: jsonData.filename, // Filename from JSON
        type: jsonData.type,         // Original import type (e.g., "faces", "model")
        status: jsonData.status,     // Status (e.g., "draft", "ACCEPTED")
        importType: jsonData.importType, // Consistent with type
      };
    } catch (error) {
      console.error(`Error reading or parsing JSON sidecar ${jsonFilePath}:`, error);
      return null;
    }
  }
  return null;
};

export function getFolderStructure(basePath: string): FolderStructure[] {
  const structure: FolderStructure[] = [];
  try {
    const items = fs.readdirSync(basePath);
    for (const item of items) {
      const itemPath = path.join(basePath, item);
      const stats = fs.statSync(itemPath);

      if (stats.isDirectory()) {
        structure.push({
          name: item,
          children: getFolderStructure(itemPath), // Recursively get structure of child folder
        });
      }
    }
  } catch (error) {
    console.error(
      `Error reading folder structure for ${basePath}:`,
      (error as Error).message
    );
  }
  return structure;
}

export const sortFilesByDate = (files: ScannedFile[]): ScannedFile[] => {
  return files.sort((a, b) => new Date(b.created).getTime() - new Date(a.created).getTime());

};

export const scanFolderRecursive = (basePath: string, subPath: string): ScannedFile[]  => {
  const currentPath = path.join(basePath, subPath);
  let results: ScannedFile[] = [];
  try {
    const items = fs.readdirSync(currentPath);
    for (const item of items) {
      const itemSubPath = path.join(subPath, item);
      const itemFullPath = path.join(basePath, itemSubPath);
      const stats = fs.statSync(itemFullPath);

      if (stats.isFile()) {
        const ext = path.extname(item).toLowerCase();
        const allowedExtensions = [".png", ".jpg", ".jpeg"];

        if (allowedExtensions.includes(ext)) {
        
          const resultItem = {
            name: SFW_MODE ? "sfw.png" : item,
            path: SFW_MODE ? "sfw.png" :  itemSubPath.replace(/\\/g, "/"),
            created: stats.birthtime,
            //createdFmt: formatDateToCustomFormat(stats.birthtime),
          }

          results.push(resultItem);
        }
      } else if (stats.isDirectory()) {
        results = results.concat(
          scanFolderRecursive(basePath, itemSubPath)
        );
      }
    }
  } catch (error) {
    console.error(`Error scanning folder ${currentPath}:`, (error as Error).message);
  }
  return results;

}
 
 

 