import React, { useState } from "react";
import {
	VscChromeMaximize,
	VscChromeMinimize,
	VscChromeRestore,
	VscClose,
} from "react-icons/vsc";
import { TitleBarAction } from "../../../constants/Enum";
import Searchbar from "../Searchbar";
import styles from "./component.module.scss";

export default function TitleBar() {
	const [maximized, setMaximized] = useState(false);

	return (
		<header className={styles.header}>
			<Searchbar />
			<div className={styles.titleBarButtons}>
				<button
					type="button"
					className={styles.titleBarButton}
					onClick={() =>
						window.electronAPI
							.titleBarAction(TitleBarAction.MINIMIZE_WINDOW)
							.then(setMaximized)
					}
				>
					<VscChromeMinimize />
				</button>
				<button
					type="button"
					className={styles.titleBarButton}
					onClick={() =>
						window.electronAPI
							.titleBarAction(TitleBarAction.MAXIMIZE_WINDOW)
							.then(setMaximized)
					}
				>
					{maximized ? <VscChromeRestore /> : <VscChromeMaximize />}
				</button>
				<button
					type="button"
					className={styles.titleBarButton}
					onClick={() =>
						window.electronAPI
							.titleBarAction(TitleBarAction.CLOSE_WINDOW)
							.then(setMaximized)
					}
				>
					<VscClose />
				</button>
			</div>
		</header>
	);
}
