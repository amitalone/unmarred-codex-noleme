import { FaceImage, ModelImage, OutputImage, ScannedFile } from "@repo/shared-interfaces";
import { FileSystemUtil } from "../utils/";
import { TransformerUtil } from "../utils/";
import { addWatchPath } from "../utils/FileSystemUtil";

const LOCAL_LOCAL_FS_PATH = "C:/workspace/face-swap-fs/";
const LOCAL_UPLOAD_IMAGE_FOLDER_BASE = LOCAL_LOCAL_FS_PATH;
const DAM_URL = "http://192.168.50.38:8000";
const RELATIVE_FACES_PATH = "/faces/";
const RELATIVE_MODEL_PATH = "/model/";
const  RELATIVE_OUTPUT_PATH =  "output/";

// Initialize watch paths for caching
addWatchPath(LOCAL_LOCAL_FS_PATH);


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