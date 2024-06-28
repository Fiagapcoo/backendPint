const { QueryTypes } = require('sequelize');
const db = require('../../models'); 

//Procedure to Create an Album
async function spCreateAlbum(eventId, subAreaId, title) {
    const transaction = await db.sequelize.transaction();
    try {
        await db.sequelize.query(
            `INSERT INTO "dynamic_content"."albums" ("event_id", "sub_area_id", "creation_date", "title")
        VALUES (:eventId, :subAreaId, CURRENT_TIMESTAMP, :title)`,
            { replacements: { eventId, subAreaId, title }, type: QueryTypes.RAW, transaction }
        );

        await transaction.commit();
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
}

//Procedure to Add a Photograph
async function spAddPhotograph(albumId, publisherId, filePath) {
    const transaction = await db.sequelize.transaction();
    try {
        await db.sequelize.query(
            `INSERT INTO "dynamic_content"."photographs" ("album_id", "publisher_id", "filepath", "upload_date")
        VALUES (:albumId, :publisherId, :filePath, CURRENT_TIMESTAMP)`,
            { replacements: { albumId, publisherId, filePath }, type: QueryTypes.RAW, transaction }
        );

        await transaction.commit();
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
}

module.exports = {
    spCreateAlbum,
    spAddPhotograph
}