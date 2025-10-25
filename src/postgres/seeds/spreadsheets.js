/**
 * @param {import("knex").Knex} knex
 * @returns {Promise<void>}
 */
// export async function seed(knex) {
//     await knex("spreadsheets")
//         .insert([{ spreadsheet_id: "some_spreadsheet" }])
//         .onConflict(["spreadsheet_id"])
//         .ignore();
// }
// import { Knex } from "knex";

import { fetchTariffs } from "#services/fetchTarriffs.js";

// /**
//  * @param {(arg0: string) => {
//  *     (): any;
//  *     new (): any;
//  *     del: { (): any; new (): any };
//  *     insert: {
//  *         (
//  *             arg0: {
//  *                 geo_name: string;
//  *                 box_delivery_base: number;
//  *                 box_delivery_coef_expr: number;
//  *                 box_delivery_liter: number;
//  *                 box_storage_base: number;
//  *                 box_storage_coef_expr: number;
//  *                 box_storage_liter: number;
//  *             }[],
//  *         ): any;
//  *         new (): any;
//  *     };
//  * }} knex
//  */
export async function seed() {
    await fetchTariffs();
}
