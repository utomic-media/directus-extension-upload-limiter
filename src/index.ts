import { defineHook } from '@directus/extensions-sdk';
import { updateUserUploadData } from './functions';
import { usersFileDeletions, directusFile, modificationObject } from './types';


export default defineHook(({ filter, action }, { services, exceptions, env }) => {
	const { UsersService, FilesService } = services;

	// TODO: Case: filter upload: 
	// run filter before upload and check if it would fit into the limit
		// yes: upload file
		// no: send error: "upload-limit: this file would exceed your upload limit"
	
	// Note: move to db-config once a key-value store is available
	// const globalUploadLimit = env.DIRECTUS_EXTENSION_UPLOAD_LIMITER_GLOBAL_LIMIT; // upload-limit in byte
	

	// CASE: AFTER UPLOAD
	// update user column uploaded filedata with new data
	action('files.upload', async ({ payload }, { schema, accountability }) => {
		const uploadUser = accountability?.user;

		// TODO: fetch public uploads without user (key-value store required)
		if (!uploadUser) return;

		const usersService = new UsersService({
			schema: schema,
			accountability: {
				admin: true, // TODO: find a better way to restrict this
				...accountability
			},
		});
		
		try {
			const modifications: modificationObject = {
				modification: 'add',
				numberOfFiles: 1,
				aggregatedFilessize: BigInt(payload.filesize),
			}

			await updateUserUploadData(uploadUser, usersService, modifications);			
		} catch (error) {
			throw new Error(`File-Tracking failed: ${error}`);
		}
		
	});


	// TODO: Case: update
	// get filesize before, filesize after, calc diff and apply to value


	// CASE: BEFORE DELETE
	// remove file and fizesize from extensions data (referred to the original userwho uploaded the file!)
	filter('files.delete', async (payload, { collection }, { schema, accountability }) => {
		const filesService = new FilesService({
			schema: schema,
			accountability: {
				admin: true, // TODO: find a better way to restrict this
				...accountability
			},
		});

		const usersService = new UsersService({
			schema: schema,
			// NOTE: do not use user accountability here, as this file-service is already only executed if the user is allowed to delete a file
			// otherwise you'll probably get an error about permissions on directus_activity in cases where a user is allowed to manage all data but not access all users and userdata
			// accountability: {
			// 	admin: true, // find a better way to restrict this
				// ...accountability
			// },
		});


		try {
			// get all files that should be deleted
			const filesToDelete: directusFile[] = await filesService.readMany(payload);

			// structure all changes to run them user-based instead of all one by one!
			let fileChanges = {} as usersFileDeletions;

			filesToDelete.forEach((file: directusFile) => {
				if (!file.uploaded_by) return;

				if (!fileChanges[file.uploaded_by]) {
					fileChanges[file.uploaded_by] = {
						numberOfFiles: 1,
						aggregatedFilessize: BigInt(file.filesize),
					};
				} else {
					fileChanges[file.uploaded_by]!.numberOfFiles += 1;
					fileChanges[file.uploaded_by]!.aggregatedFilessize += BigInt(file.filesize);
				}
			});

			// update changes aggregated by user
			for (const user in fileChanges) {
				const modificaion: modificationObject = {
					modification: 'subtract',
					numberOfFiles: fileChanges[user]!.numberOfFiles,
					aggregatedFilessize: fileChanges[user]!.aggregatedFilessize,
				}
				await updateUserUploadData(user, usersService, modificaion);
			}

		} catch (error) {
			throw new Error(`File-Tracking failed: ${error}`);
		}
	});
});
