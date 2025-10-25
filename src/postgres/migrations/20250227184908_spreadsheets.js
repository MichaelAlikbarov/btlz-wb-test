/**
 * @param {import("knex").Knex} knex
 * @returns {Promise<void>}
 */
// export async function up(knex) {
//     return knex.schema.createTable("spreadsheets", (table) => {
//         table.string("spreadsheet_id").primary();
//     });
// }



/**
 * @param {import("knex").Knex} knex
 * @returns {Promise<void>}
 */
// export async function down(knex) {
//     return knex.schema.dropTable("spreadsheets");
// }
export function up(knex) {
    return knex.schema.createTable("tariffs", (table) => {
        table.increments("id").primary();
        table.string("geo_name").notNullable();
        table.string("warehouse_name").notNullable();

        table.decimal("box_delivery_base");
        table.decimal("box_delivery_coef_expr");
        table.decimal("box_delivery_liter");

        table.decimal("box_storage_base");
        table.decimal("box_storage_coef_expr");
        table.decimal("box_storage_liter");

        table.decimal("box_delivery_marketplace_base");
        table.decimal("box_delivery_marketplace_coef_expr");
        table.decimal("box_delivery_marketplace_liter");

        table.timestamp("created_at").defaultTo(knex.fn.now());
    });
}

/**
 * @param {{ schema: { dropTable: (arg0: string) => any; }; }} knex
 */
export function down(knex) {
    return knex.schema.dropTable("tariffs");
}
