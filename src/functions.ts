import { modificationObject, uploadLimiterOptions } from "./types";

export async function updateUserUploadData(userID: string, usersService: any, modificationObject: modificationObject) { 
  const fetchedUserData = await usersService.readOne(userID, { fields: ['directus_extension_upload_limiter'] });
  const oldExtensionUserData: uploadLimiterOptions | null = JSON.parse(fetchedUserData.directus_extension_upload_limiter);

  // DEBUG
  // console.log(fetchedUserData);
  // console.log(oldExtensionUserData)

  // Init values to track
  let numberOfFiles = oldExtensionUserData?.numberOfFiles || 0;
  // !! Note: can't use normal "or" as above as otherwise the filesize will be read as string and then be concatenated!
  // !!       use BigInt conversion!!
  let aggregatedFilessize = oldExtensionUserData?.aggregatedFilessize ? BigInt(oldExtensionUserData.aggregatedFilessize) : BigInt(0);
  

  // Calculation for file deletion
  if (modificationObject.modification === 'subtract') {
    numberOfFiles -= modificationObject.numberOfFiles;
    aggregatedFilessize -= modificationObject.aggregatedFilessize;
  }
  // Calculation for file addition
  else if (modificationObject.modification === 'add') {
    numberOfFiles += modificationObject.numberOfFiles;
    aggregatedFilessize += modificationObject.aggregatedFilessize;
  }
  // Catch errors
  else {
    throw Error('Unknown modification command');
  }

  if (numberOfFiles < 0 || aggregatedFilessize < BigInt(0)) {
    throw Error("A user can't have negative uploads, reset the upload extension and recalculate the values");
  }


  // Update user-Data
  try {
    await usersService.updateOne(userID, {
      'directus_extension_upload_limiter': {
        ...oldExtensionUserData,
        numberOfFiles: numberOfFiles,
        aggregatedFilessize: aggregatedFilessize,
      }

    });
  } catch(error) {
    throw new Error(`[UPDATING 'directus_extension_upload_limiter' field failed]: ${error}`);
  }
  

}