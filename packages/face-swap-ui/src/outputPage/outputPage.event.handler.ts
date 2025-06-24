export const ButtonNames = {
    DELETE: "DELETE",
    BOOKMARK: "BOOKMARK",
    FACE_IMAGE: "FACE",
    MODEL_IMAGE: "MODEL",
}

export function buttonActionHandler(name:string, payload:any = null): void {
  console.log(`${name} button clicked ${JSON.stringify(payload)}`);
}