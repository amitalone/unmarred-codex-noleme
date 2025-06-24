export const ButtonNames = {
    DELETE: "DELETE",
    BOOKMARK: "BOOKMARK",
    FACE_IMAGE: "FACE",
    MODEL_IMAGE: "MODEL",
}

export function buttonActionHandler(name:string, payload:any = null): void {
  console.log(`${name} button clicked ${JSON.stringify(payload)}`);
}

export function deleteActionHandler(): void {
  console.log("Delete button clicked");
}

/**
 * Handles the bookmark button click event
 */
export function bookmarkActionHandler(): void {
  console.log("Bookmark button clicked");
}

/**
 * Handles the image button click event
 */
export function imageActionHandler(): void {
  console.log("Image button clicked");
}

/**
 * Handles the square image button click event
 */
export function squareImageActionHandler(): void {
  console.log("Square image button clicked");
}
