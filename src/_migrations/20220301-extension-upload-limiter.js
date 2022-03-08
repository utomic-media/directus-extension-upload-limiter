module.exports = {

	async up(knex) {
		await knex.schema.alterTable('directus_users', (table) => {
			table.json('directus_extension_upload_limiter');
		});
	},

	async down(knex) {
		await knex.schema.alterTable('directus_users', (table) => {
			table.dropColumn('directus_extension_upload_limiter');
		});
	},
};