 const UI_BFF_BASE_URL = "http://localhost:4001/api"

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