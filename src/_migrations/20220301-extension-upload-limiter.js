module.exports = {

	async up(knex) {
		await knex.schema.alterTable('directus_users', (table) => {
			table.json('directus-extension-upload-limiter');
		});
	},

	async down(knex) {
		await knex.schema.alterTable('directus_users', (table) => {
			table.dropColumn('directus-extension-upload-limiter');
		});
	},
};