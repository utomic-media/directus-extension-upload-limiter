export interface uploadLimiterOptions {
	numberOfFiles: number,
	aggregatedFilessize: bigint,
}

export interface usersFileDeletions {
	[userID: string]: uploadLimiterOptions,
}

export interface modificationObject extends uploadLimiterOptions {
	modification: 'add' | 'subtract',
}

export interface directusFile {
	id: string; // uuid
	storage: string;
	filename_disk: string;
	filename_download: string;
	title: string | null;
	type: string | null;
	folder: string | null; // uuid
	uploaded_by: string | null; // uuid
	uploaded_on: Date;
	charset: string | null;
	filesize: number;
	width: number | null;
	height: number | null;
	duration: number | null;
	embed: string | null;
	description: string | null;
	location: string | null;
	tags: string | null;
	metadata: Record<string, any> | null;
}