import { findModuleChild } from "@millennium/ui";

export const CreatePopupBase: any = findModuleChild((m) => {
	if (typeof m !== "object") return undefined;
	for (let prop in m) {
		if (
			typeof m[prop] === "function" &&
			m[prop]?.toString().includes("CreatePopup(this.m_strName") &&
			m[prop]?.toString().includes("GetWindowRestoreDetails")
		) {
			return m[prop];
		}
	}
});
