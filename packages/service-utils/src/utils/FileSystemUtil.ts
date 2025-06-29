import * as fs from "fs";
import * as path from "path";
import * as os from "os";
import sharp from "sharp";

import { ScannedFile } from "@repo/shared-interfaces";
import { createFileSystemCacheManager } from "../cache";
import { formatDateToCustomFormat } from "../utils/TransformerUtil";
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


const SFW_MODE = false;

// Initialize cache manager for file system operations
const cacheManager = createFileSystemCacheManager({
  watchPaths: [], // Will be populated dynamically
  ttl: 300, // 5 minutes
  debug: process.env.NODE_ENV === 'development'
});



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

// Original uncached function
const scanFolderRecursiveUncached = (basePath: string, subPath: string): ScannedFile[]  => {
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
          scanFolderRecursiveUncached(basePath, itemSubPath)
        );
      }
    }
  } catch (error) {
    console.error(`Error scanning folder ${currentPath}:`, (error as Error).message);
  }
  return results;
};

// Cached version of scanFolderRecursive
export const scanFolderRecursive = cacheManager.cacheable({
  keyGenerator: (basePath: string, subPath: string) => `scan:${path.normalize(basePath)}:${path.normalize(subPath)}`,
  strategy: 'hybrid',
  ttl: 300, // 5 minutes fallback TTL
  strategyOptions: {
    watchPaths: [], // Will be populated dynamically by the file watcher strategy
    watchExtensions: ['.png', '.jpg', '.jpeg'],
    recursive: true,
    ttl: 300
  }
})(scanFolderRecursiveUncached);

/**
 * Add a path to be watched by the cache manager
 * Call this when you start scanning a new base path
 */
export const addWatchPath = (basePath: string): void => {
  // Get the hybrid strategy and add the watch path
  const hybridStrategy = (cacheManager as any).strategies.get('hybrid');
  if (hybridStrategy) {
    const fileWatcherStrategy = hybridStrategy.getPrimaryStrategy();
    if (fileWatcherStrategy && !fileWatcherStrategy.watchedPaths?.has(basePath)) {
      // Initialize watching for this path
      fileWatcherStrategy.initialize({
        watchPaths: [basePath],
        watchExtensions: ['.png', '.jpg', '.jpeg'],
        recursive: true
      }).then(() => {
        console.debug(`Added watch path: ${basePath}`);
      }).catch((error: Error) => {
        console.error(`Failed to add watch path ${basePath}:`, error);
      });
    }
  }
};


export const getFileMetadata = async (filePath: string): Promise<FileMetadata> => {
  try {
    const metadata = fs.statSync(filePath);
    const imageInfo = await sharp(filePath).metadata();
    return {
      size: metadata.size,
      created: metadata.birthtime,
      modified: metadata.mtime,
      width: imageInfo.width,
      height: imageInfo.height,
      owner: process.env.USERNAME || os.userInfo().username,
      createdFmt: formatDateToCustomFormat(metadata.birthtime),
    };
  } catch (error) {
    console.error("Error reading file metadata:", error);
    return {
      size: 0,
      created: new Date(),
      modified: new Date(),
      owner: process.env.USERNAME || os.userInfo().username,
      createdFmt: formatDateToCustomFormat(new Date()),
    };
  }
};

export const generateImageSidecar = async (
  filePath: string, 
  importType: string, 
  status: string = "draft"
): Promise<string> => {
  const fileMetadata = await getFileMetadata(filePath);
  const filename = path.basename(filePath);
  
  const imageSidecar: ImageSidecar = {
    filename: filename,
    type: importType,
    metadata: fileMetadata,
    status: status,
    importType: importType,
  };
  
  const imageSidecarPath = filePath + ".json";
  await fs.promises.writeFile(
    imageSidecarPath,
    JSON.stringify(imageSidecar, null, 2)
  );
  
  return imageSidecarPath;
};

export const getImageSidecar = async (imageFilePath: string): Promise<ImageSidecar | null> => {
   
  const jsonFilePath =`${imageFilePath}.json`

  try {
    // Check if the sidecar file exists
    await fs.promises.access(jsonFilePath, fs.constants.F_OK);
    
    // Read and parse the JSON sidecar file
    const jsonContentString = await fs.promises.readFile(jsonFilePath, "utf8");
    const jsonData: ImageSidecar = JSON.parse(jsonContentString);
    
    return jsonData;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      // File doesn't exist
      return null;
    }
    console.error(`Error reading or parsing JSON sidecar ${jsonFilePath}:`, error);
    return null;
  }
};

export const moveFiles = async (
  files: FileToMove[],
  destination: string
): Promise<MoveResult[]> => {
  const results: MoveResult[] = [];
  for (const file of files) {
    const sourcePath = file.path;
    const destPath = path.join(destination, file.name);
    try {
      await fs.promises.rename(sourcePath, destPath);
      results.push({ success: true, message: `Moved ${file.name} to ${destination}` });
    } catch (error) {
      console.error(`Error moving file ${file.name}:`, error);
      results.push({ success: false, message: `Failed to move ${file.name}` });
    }
  }
  return results;
};