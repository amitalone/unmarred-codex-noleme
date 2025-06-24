import * as fs from "fs";
import * as path from "path";
import * as os from "os";
import sharp from "sharp";
import {
  FileMetadata,
  ImageSidecar,
  FileToMove,
  MoveResult,
  FolderStructure,
  TreeViewItem,
  ScannedFile,
  FilterOptions,
  ImagesAndFiltersResult,
  UploadedFile
} from "./interfaces.js";

// const LOCAL_UPLOAD_IMAGE_FOLDER_BASE =
//   "C:/workspace/face-swap-fs/imported-files";
const LOCAL_LOCAL_FS_PATH = "C:/workspace/face-swap-fs/";
const LOCAL_UPLOAD_IMAGE_FOLDER_BASE = LOCAL_LOCAL_FS_PATH;
const DAM_URL = "http://192.168.50.38:8000/";
const RELATIVE_FACES_PATH = "faces/";
const RELATIVE_MODEL_PATH = "model/";
const IMPORT_FILE_PATH = "imported-files/";

const SFW_MODE = false;


const deleteFile = async (fileName: string): Promise<{ success: boolean; error?: string }> => {
  try {
    let filePath = "";
    filePath = path.join(LOCAL_LOCAL_FS_PATH, fileName);
    await fs.promises.unlink(filePath);
    //TODO: Check regexs when mode/face ext is part of filename
    const jsonPath = filePath.replace(/\.[^/.]+$/, ".json");
    if (fs.existsSync(jsonPath)) {
      await fs.promises.unlink(jsonPath);
    }
    return { success: true };
  } catch (error) {
    console.error(`Error deleting file ${fileName}:`, error);
    return { success: false, error: (error as Error).message };
  }
};

const moveFiles = async (fileList: FileToMove[]): Promise<MoveResult[]> => {
  const results: MoveResult[] = [];
  try {
    for (const file of fileList) {
      const result: MoveResult = { filename: file.name, success: false, error: null };
      try {
        const targetFolder = file.type === "model" ? RELATIVE_MODEL_PATH : RELATIVE_FACES_PATH;
        const targetPath = path.join(
          LOCAL_UPLOAD_IMAGE_FOLDER_BASE,
          targetFolder
        );

        fs.mkdirSync(targetPath, { recursive: true });

        const sourcePath = path.join(LOCAL_UPLOAD_IMAGE_FOLDER_BASE, file.name);
        const sourceJsonPath = sourcePath.replace(/\.[^/.]+$/, ".json");

        let targetFilePath = path.join(targetPath, path.basename(file.name));
        let targetJsonPath = targetFilePath.replace(/\.[^/.]+$/, ".json");

        // If file exists, append number until we find a free filename
        let counter = 1;
        while (fs.existsSync(targetFilePath)) {
          const ext = path.extname(file.name);
          const baseName = path.basename(file.name, ext);
          const newName = `${baseName}_${String(counter).padStart(2, "0")}${ext}`;
          targetFilePath = path.join(targetPath, newName);
          targetJsonPath = targetFilePath.replace(/\.[^/.]+$/, ".json");
          counter++;
        }
        // If path is too long, create a shorter filename with prefix
        if (file.name.length > 10) {
          const ext = path.extname(file.name);
          const prefix = file.type === "model" ? "model_" : "face_";
          const randomPart = Math.random().toString(36).substring(2, 10);
          const newName = `${prefix}${randomPart}${ext}`.replace(/\s+/g, "_");
          targetFilePath = path.join(targetPath, newName);
          targetJsonPath = targetFilePath.replace(/\.[^/.]+$/, ".json");
        }
        console.log(
          `Moving to target filename (relative): ${path.join(path.basename(targetFolder), path.basename(targetFilePath))}`
        );
        const targetFileName =
          `${path.join(path.basename(targetFolder), path.basename(targetFilePath))}`.replace(
            /\\/g,
            "/"
          );

        await fs.promises.rename(sourcePath, targetFilePath);
        if (fs.existsSync(sourceJsonPath)) {
          await fs.promises.rename(sourceJsonPath, targetJsonPath);
          // Read and update JSON metadata
          const jsonContent = JSON.parse(
            fs.readFileSync(targetJsonPath, "utf8")
          );
          jsonContent.status = "ACCEPTED";
          jsonContent.filename = targetFileName;
          await fs.promises.writeFile(
            targetJsonPath,
            JSON.stringify(jsonContent, null, 2)
          );
        }
        result.success = true;
      } catch (error) {
        result.error = (error as Error).message;
      }
      results.push(result);
    }
    return results;
  } catch (error) {
    console.error("Error moving files:", error);
    return results;
  }
};

const formatDateToCustomFormat = (date: Date): string => {
  const day = date.getDate();
  const month = date.toLocaleString('default', { month: 'short' });
  const year = date.getFullYear().toString().slice(-2);

  const daySuffix = (day: number): string => {
    if (day > 3 && day < 21) return 'th';
    switch (day % 10) {
      case 1: return 'st';
      case 2: return 'nd';
      case 3: return 'rd';
      default: return 'th';
    }
  };

  return `${day}${daySuffix(day)}${month}${year}`;
};

const getFileMetadata = async (filePath: string): Promise<FileMetadata> => {
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
      computer: os.hostname(),
      createdFmt: formatDateToCustomFormat(metadata.birthtime),
    };
  } catch (error) {
    console.error("Error reading file metadata:", error);
    return {
      size: 0,
      created: new Date(),
      modified: new Date(),
      owner: process.env.USERNAME || os.userInfo().username,
      computer: os.hostname(),
      createdFmt: formatDateToCustomFormat(new Date()),
    };
  }
};


const processUploadedFiles = async (files: UploadedFile[], importType: string): Promise<string[]> => {
  const uploadedFiles: string[] = [];
  for (const file of files) {
    const currentDate = new Date().toISOString().split("T")[0];
    const filePath = path.join(
      LOCAL_LOCAL_FS_PATH+ IMPORT_FILE_PATH,
      currentDate || '',
      file.filename
    );
    // Ensure the directory exists
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    // Save the file to the local filesystem
    const buffer = await file.toBuffer();
    await fs.promises.writeFile(filePath, buffer);

    let fileMetadata = await getFileMetadata(filePath);

    const imageSidecar: ImageSidecar = {
      filename: file.filename,
      //mimetype: file.mimetype,
      type: importType,
      metadata: fileMetadata,
      status: "draft",
      importType: importType,
    };
    const imageSidecarPath = filePath.replace(/\.[^/.]+$/, ".json");
    await fs.promises.writeFile(
      imageSidecarPath,
      JSON.stringify(imageSidecar, null, 2)
    );
    uploadedFiles.push(file.filename);
    console.log("Received file:", {
      filename: file.filename,
      encoding: file.encoding,
      mimetype: file.mimetype,
      fieldname: file.fieldname,
      importType: importType,
    });
  }
  return uploadedFiles;
};

function getFolderStructure(basePath: string): FolderStructure[] {
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

function transformToTreeViewFormat(folderStructure: FolderStructure[], parentIdPrefix = ""): TreeViewItem[] {
  return folderStructure.map((folder) => {
    const sanitizedName = folder.name;

    // Generate a random 4-digit number
    const randomDigits = Math.floor(1000 + Math.random() * 9000);
    const id = parentIdPrefix
      ? `${parentIdPrefix}-${sanitizedName}` // Append random digits to child IDs
      : `${sanitizedName}`; // Append random digits to root IDs

    const treeItem: TreeViewItem = {
      id: id,
      label: folder.name,
    };

    if (folder.children && folder.children.length > 0) {
      treeItem.children = transformToTreeViewFormat(folder.children, id);
    }

    return treeItem;
  });
}

// Helper function to read and parse JSON sidecar for imported files
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


// Move to seperate util
const pageSize = 25;
const getPaginatedFiles = (allFiles: ScannedFile[], pageNumber: number): ScannedFile[] => {
  const startIndex = (pageNumber - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  return allFiles.slice(startIndex, endIndex);
};

const scanFolderRecursiveSimple = (basePath: string, subPath: string, scanType: string): ScannedFile[] => {
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
          let faceName: string | null = null;
          let modelName: string | null = null;

          if (scanType === "output") {
            const parts = item.split("--");
            if (parts.length >= 2) {
              faceName = parts[0] || null;
              modelName = parts[1] || null; // Get filename without the final extension
            }
          }
          const resultItem = {
            filename: SFW_MODE ? "sfw.png" : item,
            relativePath: SFW_MODE ? "sfw.png" : itemSubPath.replace(/\\/g, "/"),
            scanType: scanType,
            faceName: faceName,
            modelName: modelName,
            created: stats.birthtime, // Add creation date for sorting
            createdFmt: formatDateToCustomFormat(stats.birthtime),
          }

          let filenameToUse = item;
          if (scanType === "imported-files") {
            const sidecarData = readImageSidecarSync(itemFullPath);
            if (sidecarData && typeof sidecarData.filename === 'string') {
             filenameToUse = sidecarData.filename;
              const { type, status, importType } = sidecarData;
              //resultItem.importType = importType;
              resultItem.scanType = type;
              resultItem.status = status;
             
            } 
          }
          results.push(resultItem);
        }
      } else if (stats.isDirectory()) {
        results = results.concat(
          scanFolderRecursiveSimple(basePath, itemSubPath, scanType)
        );
      }
    }
  } catch (error) {
    console.error(`Error scanning folder ${currentPath}:`, (error as Error).message);
  }
  return results;
};

const getImagesAndFilters = (
  folderPath: string,
  subFolderPath: string,
  pageNumber: number,
  folderType: string,
  fileTypefilter?: FilterOptions
): ImagesAndFiltersResult => {
  // pageNumber is not currently used by this function or scanFolder
  let allScannedFiles = scanFolderRecursiveSimple(
    folderPath,
    subFolderPath,
    folderType
  );

  if (
    fileTypefilter &&
    fileTypefilter.filterType &&
    fileTypefilter.filterValue
  ) {
    if (fileTypefilter.filterType === "faces") {
      allScannedFiles = allScannedFiles.filter(
        (file) => file.faceName === fileTypefilter.filterValue
      );
    } else if (fileTypefilter.filterType === "models") {
      allScannedFiles = allScannedFiles.filter(
        (file) => file.modelName === fileTypefilter.filterValue
      );
    }
  }

  // Sort files by creation date (most recent first)
  allScannedFiles.sort((a, b) => new Date(b.created).getTime() - new Date(a.created).getTime());

  const paginatedFiles = getPaginatedFiles(allScannedFiles, pageNumber);

  return {
    page: pageNumber,
    pageSize: pageSize,
    totalFiles: allScannedFiles.length,
    totalPages: Math.ceil(allScannedFiles.length / pageSize),
    // facets: facets,
    files: paginatedFiles, // Return paginated files
    damURL: DAM_URL,
    facesPath: RELATIVE_FACES_PATH,
    modelsPath: RELATIVE_MODEL_PATH,
  };
};

const findCombination = (
  faces: string[],
  models: string[],
  outputList: ScannedFile[]
): { face: string; model: string; output: string; facePath: string; modelPath: string; relativePath: string }[] => {
  const foundCombinations: ScannedFile[] = [];
  faces.forEach((face: string) => {
    models.forEach((model: string) => {
      const existingCombo = faceModelComboExists(face, model, outputList);
      if (existingCombo) {
        foundCombinations.push(existingCombo);
      }  
    });
  });
  
  return foundCombinations.map(combo => {
    const faceName = combo.faceName || '';
    const modelName = combo.modelName || '';
    return {
      face: faceName,
      model: modelName,
      output: DAM_URL + combo.relativePath,
      facePath: DAM_URL + RELATIVE_FACES_PATH + faceName,
      modelPath: DAM_URL + RELATIVE_MODEL_PATH + modelName,
      relativePath: combo.relativePath
    };
  });
};

const faceModelComboExists = (
  face: string,
  model: string,
  list: ScannedFile[]
): ScannedFile | null => {
  if (!Array.isArray(list)) {
    console.error("Expected list to be an array, but got:", list);
    return null;
  }
  for (const item of list) {
    // Ensure faceName and modelName are not null before comparing
    if (item.faceName && item.faceName === face && item.modelName && item.modelName === model) {
      return item;
    }
  }
  return null;
};

export default {
  processUploadedFiles,
  moveFiles,
  deleteFile,
  getFolderStructure,
  transformToTreeViewFormat,
  getImagesAndFilters,
  findCombination,
  faceModelComboExists,
  scanFolderRecursiveSimple
};