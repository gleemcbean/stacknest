declare module "*.scss" {
	const content: { [className: string]: string };
	export default content;
}

declare module "*.module.scss" {
	const content: { [className: string]: string };
	export default content;
}

declare global {
	interface Technology {
		id: string;
		name: string;
		documentationURL: string | null;
		includeFiles: string[];
	}

	enum GitStatus {
		Unavailable,
		Commited,
		Uncommited,
	}

	interface Project {
		description: string;
		path: string;
		technologies: Technology[];
		lastEdited: string;
		gitStatus: GitStatus;
	}

	interface Window {
		electronAPI: {
			projects: () => Project[];
		};
	}
}
