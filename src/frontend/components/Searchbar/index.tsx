import React from "react";
import styles from "./component.module.scss";

export default function Searchbar() {
	return (
		<form className={styles.searchbar}>
			<input type="text" />
			<button type="button">Search</button>
		</form>
	);
}
