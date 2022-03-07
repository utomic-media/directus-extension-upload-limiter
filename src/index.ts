import { defineHook } from '@directus/extensions-sdk';

export default defineHook(({ filter, action }) => {


	// get upload-limit from env variables, set to fals if none is set

	// before upload: check if fits into the limit
		// yes: upload file
		// no: send error: "upload-limit: this file would exceed your upload limit"
	
	// after: update user column uploaded filedata

	// filter('items.create', () => {
	// 	console.log('Creating Item!');
	// });

	// action('items.create', () => {
	// 	console.log('Item created!');
	// });
});
