 const UI_BFF_BASE_URL = "http://192.168.50.38:4001/api"

import {FACE_SWAP_BFF_ROUTES} from "@repo/shared-interfaces";
import {ApiClient} from "@repo/base-ui";


export const resultsByPathURL = async (path: string, pageNumber: string) => {
    return await ApiClient.get(`${UI_BFF_BASE_URL}${FACE_SWAP_BFF_ROUTES.resultByFacetValue.replace(':path', path).replace(':pageNumber', pageNumber)}`);
}

export const getFaces = async (pageNumber: string) => {
    return await ApiClient.get(`${UI_BFF_BASE_URL}${FACE_SWAP_BFF_ROUTES.faces.replace(':pageNumber', pageNumber)}`);
}

export const getModels = async (pageNumber: string) => {
    return await ApiClient.get(`${UI_BFF_BASE_URL}${FACE_SWAP_BFF_ROUTES.models.replace(':pageNumber', pageNumber)}`);
}

export const getDraftImages = async (pageNumber: string) => {
    return await ApiClient.get(`${UI_BFF_BASE_URL}${FACE_SWAP_BFF_ROUTES.draftImages.replace(':pageNumber', pageNumber)}`);
}

export const validateCombination = async (faces: string[], models: string[]) => {
    const payload = { faces, models };
    return await ApiClient.post(`${UI_BFF_BASE_URL}${FACE_SWAP_BFF_ROUTES.validateCombination}`, payload);
}

export const submitImages = async (faces: string[], models: string[]) => {
    const payload = { faces, models };
    console.log("Submitting images with payload:", payload);
    return await ApiClient.post(`${UI_BFF_BASE_URL}${FACE_SWAP_BFF_ROUTES.submitImages}`, payload);
}

export const uploadToDraft = async (formData: FormData) => {
    console.log("Uploading files to draft with FormData");
    
    // Debug log FormData contents
    console.log("FormData contents:");
    for (const [key, value] of formData.entries()) {
        if (value instanceof File) {
            console.log(`  ${key}: File(${value.name}, ${value.size} bytes, ${value.type})`);
        } else {
            console.log(`  ${key}: ${value}`);
        }
    }
    
    return await ApiClient.post(`${UI_BFF_BASE_URL}${FACE_SWAP_BFF_ROUTES.uploadToDraft}`, formData);
}