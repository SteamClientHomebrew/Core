import { findModuleChild } from "@millennium/ui";

export const TitleBar: any = findModuleChild((m) => {
  if (typeof m !== "object") return undefined;
  for (let prop in m) {
    if (
      typeof m[prop] === "function" &&
      m[prop].toString().includes('className:"title-area-highlight"')
    ) {
      return m[prop];
    }
  }
});
