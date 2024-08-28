const { QueryTypes } = require("sequelize");
const db = require("../../models");

async function spCreateAlbum(eventId, subAreaId, title) {
  const transaction = await db.sequelize.transaction();
  try {
    await db.sequelize.query(
      `INSERT INTO "dynamic_content"."albums" ("event_id", "sub_area_id", "creation_date", "title")
        VALUES (:eventId, :subAreaId, CURRENT_TIMESTAMP, :title)`,
      {
        replacements: { eventId, subAreaId, title },
        type: QueryTypes.RAW,
        transaction,
      }
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
      {
        replacements: { albumId, publisherId, filePath },
        type: QueryTypes.RAW,
        transaction,
      }
    );

    await transaction.commit();
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
}

async function spGetAlbums() {
  const albums = await db.sequelize.query(
    `SELECT * FROM "dynamic_content"."albuns"`,
    { type: QueryTypes.SELECT }
  );

  return albums;
}

async function spGetAlbumPhoto(photo_id) {
  const photo = await db.sequelize.query(
    `SELECT p.filepath, u.first_name, u.last_name 
FROM "dynamic_content"."photographs" p
JOIN "hr"."users" u ON u.user_id = p.publisher_id 
WHERE p.album_id = :photo_id`,
    { replacements: { photo_id }, type: QueryTypes.SELECT }
  );

  return photo;
}
module.exports = {
  spCreateAlbum,
  spAddPhotograph,
  spGetAlbums,
  spGetAlbumPhoto,
};
