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

export const validateCombination = async (faces: string[], models: string[]) => {
    const payload = { faces, models };
    return await ApiClient.post(`${UI_BFF_BASE_URL}${FACE_SWAP_BFF_ROUTES.validateCombination}`, payload);
}

export const submitImages = async (faces: string[], models: string[]) => {
    const payload = { faces, models };
    console.log("Submitting images with payload:", payload);
    return await ApiClient.post(`${UI_BFF_BASE_URL}${FACE_SWAP_BFF_ROUTES.submitImages}`, payload);
}