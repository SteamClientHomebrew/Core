import { findModuleChild } from "@millennium/ui";
import React, { CSSProperties, ReactNode } from "react";

interface TitleBarProps {
	bOSX?: boolean;
	bForceWindowFocused?: boolean;
	children?: ReactNode;
	className?: string;
	extraActions?: ReactNode;
	hideActions?: boolean;
	hideClose?: boolean;
	hideMin?: boolean;
	hideMax?: boolean;
	onClose?: (e: PointerEvent) => void;
	onMaximize?: () => void;
	onMinimize?: (e: PointerEvent) => void;
	popup?: Window;
	style?: CSSProperties;
}

export const TitleBar: React.FC<TitleBarProps> = findModuleChild((m) => {
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
