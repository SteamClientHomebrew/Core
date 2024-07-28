import { FC } from "react";
import { findModuleChild } from "@millennium/ui";

interface BBCodeParserProps {
	bShowShortSpeakerInfo?: boolean;
	event?: any;
	languageOverride?: any;
	showErrorInfo?: boolean;
	text?: string;
}

export const BBCodeParser: FC<BBCodeParserProps> = findModuleChild((m) => {
	if (typeof m !== "object") return undefined;
	for (const prop in m) {
		if (
			typeof m[prop] === "function" &&
			m[prop].toString().includes("this.ElementAccumulator")
		) {
			return m[prop];
		}
	}
});
