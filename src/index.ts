import { defineHook } from '@directus/extensions-sdk';


interface uploadLimiterOptions {
	numberOfFiles: number,
	aggregatedFilessize: bigint,
}


export default defineHook(({ action }, { services, exceptions, env }) => {

	// TODO: before upload: check if fits into the limit
		// yes: upload file
		// no: send error: "upload-limit: this file would exceed your upload limit"
	
	// TODO: move to db-config once a key-value store is available
	// const globalUploadLimit = env.DIRECTUS_EXTENSION_UPLOAD_LIMITER_GLOBAL_LIMIT; // upload-limit in byte
	

	// after upload: update user column uploaded filedata
	action('files.upload', async ({ payload }, { schema, accountability }) => {
		const { UsersService } = services;
		const { ServiceUnavailableException } = exceptions;
		
		const uploadUser = accountability?.user;

		// TODO: fetch unknonw user
		if (uploadUser) { 
			const usersService = new UsersService({
				schema: schema,
				accountability: {
					admin: true, // TODO: find a better way to restrict this
					...accountability
				},
			});
			try {
				const userItem = await usersService.readOne(uploadUser);
				const currentUserUploadData: uploadLimiterOptions | null = JSON.parse(userItem.directus_extension_upload_limiter);

				const numberOfFiles = (currentUserUploadData?.numberOfFiles)
					? (currentUserUploadData.numberOfFiles + 1)
					: 1;
				
				const aggregatedFilessize = (currentUserUploadData?.aggregatedFilessize)
					? (currentUserUploadData.aggregatedFilessize + payload.filesize)
					: payload.filesize;
				
				await usersService.updateOne(uploadUser, {
					'directus_extension_upload_limiter': {
						...currentUserUploadData,
						numberOfFiles,
						aggregatedFilessize,
					}
				});
			} catch (error) {
				throw new ServiceUnavailableException(error);
			}
		}
	});


	// TODO: after update: get filesize before, filesize after, calc diff and apply to value

	// TODO: after delete: get old filesize and substract
	

});
