const { QueryTypes } = require('sequelize');
const db = require('../../models'); 

async function spCreateCategory(title, icon) {
    const exists = await db.sequelize.query(
        `SELECT 1 FROM "static_content"."area" WHERE "title" = :title`,
        { replacements: { title }, type: QueryTypes.SELECT }
    );

    if (exists.length === 0) {
        await db.sequelize.query(
            `INSERT INTO "static_content"."area" ("title", "icon_name") VALUES (:title, :icon)`,
            { replacements: { title, icon }, type: QueryTypes.RAW }
        );
    } else {
        console.log('Category already exists.');
    }
}

async function spCreateSubArea(areaId, title) {
    const exists = await db.sequelize.query(
        `SELECT 1 FROM "static_content"."sub_area" WHERE "title" = :title`,
        { replacements: { title }, type: QueryTypes.SELECT }
    );

    if (exists.length === 0) {
        await db.sequelize.query(
            `INSERT INTO "static_content"."sub_area" ("area_id", "title") VALUES (:areaId, :title)`,
            { replacements: { areaId, title }, type: QueryTypes.RAW }
        );
    } else {
        console.log('SubArea already exists.');
    }
}

module.exports = {
    spCreateCategory,
    spCreateSubArea
};
