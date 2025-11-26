import moment from "moment";
import React, { useEffect, useState } from "react";
import styles from "./page.module.scss";

export default function Home() {
	const [projects, setProjects] = useState<Program[]>([]);

	useEffect(() => {
		const fetchedProjects = window.electronAPI.projects();
		setProjects(fetchedProjects);
	}, []);

	return (
		<div>
			<ul className={styles.projects}>
				{projects.map((project) => (
					<li key={project.dirname} className={styles.project}>
						<div className={styles.projectHeader}>
							<h3 className={styles.title}>/{project.dirname}</h3>
							<p className={styles.date}>
								{moment(project.lastEdited).format("ddd. D MMM. YYYY")}
							</p>
						</div>
						<p className={styles.gitStatus}>Git: {project.gitStatus}</p>
						<div className={styles.projectFooter}>
							<ul className={styles.techs}>
								{project.technologies.map((tech, index) => (
									<li key={tech.id} className={styles.tech}>
										<a
											href={tech.documentationURL}
											target="_blank"
											className={styles.techUrl}
										>
											<img
												src={`/images/icons/${tech.id}.png`}
												alt={tech.name}
												className={styles.techIcon}
											/>
											{index === 0 && (
												<p className={styles.techName}>{tech.name}</p>
											)}
										</a>
									</li>
								))}
							</ul>
							<div className={styles.buttons}>
								<button
									type="button"
									className={styles.revealFileExplorer}
									onClick={() =>
										window.electronAPI.revealProject(project.dirname)
									}
								>
									Reveal in file explorer
								</button>
								<button type="button" className={styles.openVSCode}>
									Open with Visual Studio Code
								</button>
							</div>
						</div>
					</li>
				))}
			</ul>
		</div>
	);
}
