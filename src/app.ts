import knex, { migrate, seed } from "#postgres/knex.js";
import cron from 'node-cron';
import { fetchTariffs } from "#services/fetchTarriffs.js";
import { updateGoogleSheet } from "#services/googleSheets.js";

let exportCounter = 0;

async function main() {
    try {
        await migrate.latest();
        await seed.run();
        console.log("All migrations and seeds have been run");

        await fetchTariffs();

        cron.schedule('0 * * * *', async () => {
            console.log('=== Запуск синхронизации тарифов ===');
            try {
                await fetchTariffs();
                console.log("Тарифы успешно обновлены");
            } catch(err) {
                console.error("Ошибка при обновлении тарифов:", err);
            }              
        });
        console.log("Планировщик запущен (обновление каждый час)");

        async function testUpdate() {
            // const data = await getTariffsFromDb();
            await updateGoogleSheet();
        }

        testUpdate().catch(console.error);

        cron.schedule('0 8,20 * * *', async () => {
            console.log('=== Выгрузка тарифов в Google Sheets ===');
            try {
                await updateGoogleSheet();
                exportCounter++;
                console.log(`Выгрузка выполнена успешно. Счетчик: ${exportCounter}`);
            } catch(err) {
                console.error("Ошибка при выгрузке в Google Sheets:", err);
            }
        });
    } catch(err) {
        console.error('Ошибка при инициализации приложения:', err);
        process.exit(1);
    }
}

main ();