export const ButtonNames = {
  DELETE: "DELETE",
  BOOKMARK: "BOOKMARK",
  SELECT: "SELECT",
    RESULTS: "RESULTS",
}

export function buttonActionHandler(name: string, payload: any = null): void {
  console.log(`${name} button clicked ${JSON.stringify(payload)}`);
}
