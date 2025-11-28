import { ipcRenderer } from "electron";
import type { TitleBarAction } from "../../constants/Enum";

export default function titleBarAction(action: TitleBarAction) {
	return ipcRenderer.invoke("title-bar-action", action);
}
