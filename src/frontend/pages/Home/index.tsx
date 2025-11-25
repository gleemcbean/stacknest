import moment from "moment";
import React, { useEffect, useState } from "react";
import styles from "./page.module.scss";

export default function Home() {
	const [projects, setProjects] = useState<Project[]>([]);

	useEffect(() => {
		const fetchedProjects = electronAPI.projects();
		setProjects(fetchedProjects);
	}, []);

	return (
		<div>
			<ul className={styles.projects}>
				{projects.map((project) => (
					<li key={project.path} className={styles.project}>
						<h3>{project.path.substring(project.path.lastIndexOf("/"))}</h3>
						<p>{project.description}</p>
						<ul className={styles.techs}>
							{project.technologies.map((tech, index) => (
								<li key={tech.id} className={styles.tech}>
									<img
										src={`/images/icons/${tech.id}.png`}
										alt={tech.name}
										className={styles.techIcon}
									/>
									{index === 0 && (
										<p className={styles.techName}>{tech.name}</p>
									)}
								</li>
							))}
						</ul>
						<p className={styles.date}>
							{moment(project.lastEdited).format("ddd. D MMM. YYYY")}
						</p>
					</li>
				))}
			</ul>
		</div>
	);
}
