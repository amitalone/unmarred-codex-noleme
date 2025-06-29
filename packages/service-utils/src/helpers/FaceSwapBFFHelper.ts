import { DraftImage, FaceImage, ModelImage, OutputImage, ScannedFile } from "@repo/shared-interfaces";
import { FileSystemUtil } from "../utils/";
import { TransformerUtil } from "../utils/";
import { addWatchPath } from "../utils/FileSystemUtil";
import * as fs from "fs";
import * as path from "path";
import * as os from "os";
import { ImageSidecar } from "../utils/interfaces";

const LOCAL_LOCAL_FS_PATH = "C:/workspace/face-swap-fs/";
const LOCAL_UPLOAD_IMAGE_FOLDER_BASE = LOCAL_LOCAL_FS_PATH;
const DAM_URL = "http://192.168.50.38:8000";
const RELATIVE_FACES_PATH = "/faces/";
const RELATIVE_MODEL_PATH = "/model/";
const RELATIVE_OUTPUT_PATH =  "output/";
const RELATIVE_IMPORT_PATH = "/imported-files/";

// Initialize watch paths for caching
addWatchPath(LOCAL_LOCAL_FS_PATH);

export interface UploadedFile {
  filename: string;
  encoding?: string;
  mimetype?: string;
  fieldname?: string;
  toBuffer: () => Promise<Buffer>;
}

const toResultImages = (files:ScannedFile[]):OutputImage[] => {

    return files.map((file) => {
        const { face, model } = getFaceModelByResultName(file.name);
        return {
            src: DAM_URL + file.path,
            alt: "Output Image",
            created: file.created.toISOString(),
            createdfmt: TransformerUtil.formatDateToCustomFormat(file.created),
            name: file.name,
            type: 'Output',
            face: face,
            model: model
        } as OutputImage;
    });
}

const checkFaceModelCombination= async (
  faceName: string,
  modelName: string,
  list: ScannedFile[]
): Promise<OutputImage | null> => {
  if (!Array.isArray(list)) {
    console.error("Expected list to be an array, but got:", list);
    return null;
  }
  const results:OutputImage[] = toResultImages(list);
  for (const resultImage of results) {
    if (resultImage.face.name === faceName &&  resultImage.model.name === modelName) {
        return resultImage 
    }
  }
  return null;
};


const getFaceModelByResultName = (filename:string): { face: FaceImage, model: ModelImage } => {
   const parts = filename.split("--");
   let faceName = null;
   let modelName = null;
   if (parts.length >= 2) {
     faceName = parts[0] || null;
     modelName = parts[1] || null; 
   }
   const face:FaceImage = {src: DAM_URL + RELATIVE_FACES_PATH + faceName, alt: "Face Image", name: faceName || '', type: 'Face'};
   const model:ModelImage = {src: DAM_URL + RELATIVE_MODEL_PATH + modelName, alt: "Model Image", name: modelName || '', type: 'Model'};
   return { 'face': face, 'model': model };
}

const getResultImages = (allFiles:ScannedFile[], pageNumber:number, pageSize:number) => {
  const sortedFiles = FileSystemUtil.sortFilesByDate(allFiles);
  const paginatedFiles = TransformerUtil.getPaginatedFiles(sortedFiles, pageNumber, pageSize);
  const results:OutputImage[] = [];
  for (const file of paginatedFiles) {
    const { face, model } = getFaceModelByResultName(file.name);
    const result:OutputImage = {
      src: DAM_URL +  file.path ,
      alt: "Output Image",
      created: file.created.toISOString(),
      createdfmt: TransformerUtil.formatDateToCustomFormat(file.created),
      name: file.name,
      type: 'Output',
      face: face,
      model: model
    };
    results.push(result);
  }
  return results;
}

const getFacesImages = (allFiles:ScannedFile[], pageNumber:number, pageSize:number) => {
    const sortedFiles = FileSystemUtil.sortFilesByDate(allFiles);
    const paginatedFiles = TransformerUtil.getPaginatedFiles(sortedFiles, pageNumber, pageSize);
    const results:FaceImage[] = [];
    for (const file of paginatedFiles) {
        const result:FaceImage = {
            src: DAM_URL + RELATIVE_FACES_PATH + file.name,
            alt: "Face Image",
            created: file.created.toISOString(),
            createdfmt: TransformerUtil.formatDateToCustomFormat(file.created),
            name: file.name,
            type: 'Face',
        };
        results.push(result);
    }
    return results;
}

const getModelsImages = (allFiles:ScannedFile[], pageNumber:number, pageSize:number) => {
    const sortedFiles = FileSystemUtil.sortFilesByDate(allFiles);
    const paginatedFiles = TransformerUtil.getPaginatedFiles(sortedFiles, pageNumber, pageSize);
    const results:ModelImage[] = [];
    for (const file of paginatedFiles) {
        const result:ModelImage = {
            src: DAM_URL + RELATIVE_MODEL_PATH + file.name,
            alt: "Model Image",
            created: file.created.toISOString(),
            createdfmt: TransformerUtil.formatDateToCustomFormat(file.created),
            name: file.name,
            type: 'Model',
        };
        results.push(result);
    }
    return results;
}

export const getResultByFacetValue = async (basePath:string, path:string, pageNumber:number, pageSize:number) =>{
    const allFiles:ScannedFile[] = await FileSystemUtil.scanFolderRecursive(basePath, path) as ScannedFile[];
    return getResultImages(allFiles, pageNumber, pageSize);
}

export const getResultFacets = (path:string) => {
    return  TransformerUtil.transformToTreeViewFormat(FileSystemUtil.getFolderStructure(path));
}

export const getFaces = async (basePath:string,  pageNumber:number, pageSize:number) =>{
    const allFiles:ScannedFile[] = await FileSystemUtil.scanFolderRecursive(basePath, RELATIVE_FACES_PATH) as ScannedFile[];
    return getFacesImages(allFiles, pageNumber, pageSize);
}
export const getModels = async (basePath:string,  pageNumber:number, pageSize:number) =>{
    const allFiles:ScannedFile[] = await FileSystemUtil.scanFolderRecursive(basePath, RELATIVE_MODEL_PATH) as ScannedFile[];
    return getModelsImages(allFiles, pageNumber, pageSize);
}

export const checkExistingFaceModelCombination = async (
  faces: string[],
    models: string[]): Promise<OutputImage[]> => {
        const results: OutputImage[] = [];
        const outputFiles = await FileSystemUtil.scanFolderRecursive(LOCAL_LOCAL_FS_PATH, RELATIVE_OUTPUT_PATH) as ScannedFile[];
        
        for (const face of faces) {
            for (const model of models) {
                const result = await checkFaceModelCombination(face, model, outputFiles);
                if (result !== null) {
                    results.push(result);
                }
            }
        }
        return results;
  }

 


export const addDraftFiles = async (files: UploadedFile[], importType: string): Promise<string[]> => {
  const uploadedFiles: string[] = [];
  for (const file of files) {
    const currentDate = new Date().toISOString().split("T")[0];
    const filePath = path.join(
      LOCAL_LOCAL_FS_PATH+ RELATIVE_IMPORT_PATH,
      currentDate || '',
      file.filename
    );
    
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    const buffer = await file.toBuffer();
    console.log("Writing file to path:", filePath);
    await fs.promises.writeFile(filePath, buffer);

    // Use the new generic function
    await FileSystemUtil.generateImageSidecar(filePath, importType, "draft");
    
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

export const getDraftImages = async (basePath: string, pageNumber: number, pageSize: number): Promise<DraftImage[]> => {
    const allFiles: ScannedFile[] = await FileSystemUtil.scanFolderRecursive(basePath, RELATIVE_IMPORT_PATH) as ScannedFile[];
    const sortedFiles = FileSystemUtil.sortFilesByDate(allFiles);
    const paginatedFiles = TransformerUtil.getPaginatedFiles(sortedFiles, pageNumber, pageSize);
    const draftImages: DraftImage[] = [];
    
    for (const file of paginatedFiles) {
        // Get the full file path for sidecar lookup
        const fullFilePath = basePath+file.path;
        const sidecar = await FileSystemUtil.getImageSidecar(fullFilePath);
        
        // Determine the image type from sidecar, defaulting to 'Face' if no sidecar or invalid type
        const imageType = (sidecar?.type === 'model' || sidecar?.type === 'Model' ) ? 'Model' : 'Face';
        
        const draftImage: DraftImage = {
            src: DAM_URL + file.path,
            alt: "Draft Image",
            created: file.created.toISOString(),
            createdfmt: TransformerUtil.formatDateToCustomFormat(file.created),
            name: file.name,
            status: 'Draft',
            type: 'Draft',
           
            image: { 
                src: DAM_URL + file.path, 
                alt: `${imageType} Image`, 
                name: file.name, 
                type: imageType,
                 fsPath: file.path,
            }
        };
        draftImages.push(draftImage);
    }
    return draftImages;
}

export interface AcceptDraftImagesResult {
  acceptedImages: string[];
  errors: string[];
  totalProcessed: number;
}

export const acceptDraftImages = async (draftImages: DraftImage[]): Promise<AcceptDraftImagesResult> => {
  const acceptedImages: string[] = [];
  const errors: string[] = [];
  
  for (const draftImage of draftImages) {
    try {
      // Determine the destination folder based on image type
      const destinationFolder = draftImage.image.type === 'Face' 
        ? RELATIVE_FACES_PATH.replace('/', '')  // Remove leading slash
        : RELATIVE_MODEL_PATH.replace('/', '');  // Remove leading slash
      
      // Get the source file path (remove the DAM_URL prefix to get the actual file path)
      const sourcePath = path.join(LOCAL_LOCAL_FS_PATH, draftImage.image.fsPath || '');
      const destinationPath = path.join(LOCAL_LOCAL_FS_PATH, destinationFolder, draftImage.name);
      
      // Move the image file
      await fs.promises.rename(sourcePath, destinationPath);
      
      // Move the JSON sidecar file if it exists
      const sourceJsonPath = `${sourcePath}.json`;
      const destinationJsonPath = `${destinationPath}.json`;
      
      if (fs.existsSync(sourceJsonPath)) {
        await fs.promises.rename(sourceJsonPath, destinationJsonPath);
        
        // Update the sidecar file status to 'accepted'
        try {
          const sidecarContent = await fs.promises.readFile(destinationJsonPath, 'utf8');
          const sidecar = JSON.parse(sidecarContent);
          sidecar.status = 'accepted';
          await fs.promises.writeFile(destinationJsonPath, JSON.stringify(sidecar, null, 2));
        } catch (sidecarError) {
          console.warn(`Failed to update sidecar status for ${draftImage.name}:`, sidecarError);
        }
      }
      
      acceptedImages.push(draftImage.name);
      console.log(`Successfully moved ${draftImage.name} to ${destinationFolder} folder`);
      
    } catch (error) {
      const errorMessage = `Failed to process ${draftImage.name}: ${(error as Error).message}`;
      errors.push(errorMessage);
      console.error(errorMessage);
    }
  }
  
  return {
    acceptedImages,
    errors,
    totalProcessed: draftImages.length
  };
};