import axios from "axios";
import config from "#config/env/env.js";
import knex from "#postgres/knex.js";

const date = new Date().toISOString().slice(0,10);

function dataAndTime() {
    const now = new Date();

    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '1');
    const year = now.getFullYear();

    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');

    const formattedDate = `${day}.${month}.${year} ${hours}:${minutes}:${seconds}`;
    return formattedDate;
}

export async function fetchTariffs() {
    const response = await axios.get(config.WB_API_URL, {
        headers: {
            Authorization: config.WB_API_KEY
        },
        params: {
            date
        }
    });

    const warehouseList = response.data?.response?.data?.warehouseList;

    if (!Array.isArray(warehouseList)) {
        throw new Error("Некорректный формат данных от API WB");
    }
    console.log(`Найдено ${warehouseList.length} складов`);

    const parseValue = (v: string) => {
        if (v === "-" || v === undefined || v === null) return null;
        return parseFloat(v.replace(",", "."));
    };

        const tariffs = warehouseList.map((item) => ({
        geo_name: item.geoName,
        warehouse_name: item.warehouseName,
        box_delivery_base: parseValue(item.boxDeliveryBase),
        box_delivery_coef_expr: parseValue(item.boxDeliveryCoefExpr),
        box_delivery_liter: parseValue(item.boxDeliveryLiter),

        box_storage_base: parseValue(item.boxStorageBase),
        box_storage_coef_expr: parseValue(item.boxStorageCoefExpr),
        box_storage_liter: parseValue(item.boxStorageLiter),

        box_delivery_marketplace_base: parseValue(item.boxDeliveryMarketplaceBase),
        box_delivery_marketplace_coef_expr: parseValue(item.boxDeliveryMarketplaceCoefExpr),
        box_delivery_marketplace_liter: parseValue(item.boxDeliveryMarketplaceLiter),

        created_at: dataAndTime(),
    }));
    await knex("tariffs").del();
    await knex("tariffs").insert(tariffs);

    console.log(`Inserted ${tariffs.length} tariffs into PostgreSQL`);
}