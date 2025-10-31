import knex from "#postgres/knex.js";
import { google } from "googleapis";
import config from "#config/env/env.js";
import { ITariff } from "#utils/type.js";

export async function getTariffsFromDB() {
    return await knex("tariffs").select("*").orderBy("box_delivery_coef_expr", "asc");
}

async function updateSheet(tariffs: ITariff[]) {
    const auth = new google.auth.GoogleAuth({
        keyFile: config.GOOGLE_SERVICE_ACCOUNT_FILE,
        scopes: ["https://www.googleapis.com/auth/spreadsheets"]
    });

    const sheetId = config.SPREADSHEET_ID;

    const sheets = google.sheets({ version: "v4", auth });
        await sheets.spreadsheets.values.clear({
        spreadsheetId: sheetId,
        range: "stocks_coefs"
    });

    const values = tariffs.map(t => [
        t.id,
        t.created_at,
        t.geo_name,
        t.box_delivery_base,
        t.box_delivery_coef_expr,
        t.box_delivery_liter,
        t.box_delivery_marketplace_base,
        t.box_delivery_marketplace_coef_expr,
        t.box_delivery_marketplace_liter,
        t.box_storage_base,
        t.box_storage_coef_expr,
        t.box_storage_liter
    ]);

    await sheets.spreadsheets.values.update({
        spreadsheetId: sheetId,
        range: "stocks_coefs!A1",
        valueInputOption: "RAW",
        requestBody: { values }
    });

    console.log("Google Sheet updated!");
}

export async function updateGoogleSheet() {
    const tariffs = await getTariffsFromDB();
    console.log(tariffs);
    await updateSheet(tariffs);
}