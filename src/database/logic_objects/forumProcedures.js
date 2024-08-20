const { QueryTypes } = require("sequelize");
const { fnIsPublisherOfficeAdmin } = require("./generalHelpers");
const db = require("../../models");

//Procedure to Create a Forum
async function spCreateForum(
  officeID,
  subAreaId,
  title,
  description,
  publisher_id
) {
  console.log("AAAAAAAAAAAAAAAAAAAAAAAAAAAA" + officeID);
  const isOfficeAdmin = await fnIsPublisherOfficeAdmin(publisher_id);
  const validated = isOfficeAdmin ? true : false;
  let adminId = isOfficeAdmin ? publisher_id : null;

  const transaction = await db.sequelize.transaction();
  try {
    const [result] = await db.sequelize.query(
      `INSERT INTO "dynamic_content"."forums" 
            ("office_id", "sub_area_id", "title", "content", "creation_date", "publisher_id", "admin_id", "validated")
            VALUES (:officeID, :subAreaId, :title, :description, CURRENT_TIMESTAMP, :publisher_id, :adminId, :validated)
            RETURNING forum_id`,
      {
        replacements: {
          officeID,
          subAreaId,
          title,
          description,
          publisher_id,
          adminId,
          validated,
        },
        type: QueryTypes.RAW,
        transaction,
      }
    );

    // const forumId = result[0].forum_id;
    // await db.sequelize.query(
    //     `INSERT INTO "control"."event_forum_access" ("user_id", "forum_id")
    //     VALUES (:publisher_id, :forumId)`,
    //     { replacements: { publisher_id, forumId },
    //      type: QueryTypes.RAW,
    //       transaction
    //     }
    // );

    await transaction.commit();
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
}

//Procedure to Create a Forum for an Event
async function spCreateForumForEvent(
  officeId,
  subAreaId,
  title,
  description,
  publisher_id,
  adminId,
  eventId,
  transaction
) {
  //const isOfficeAdmin = await fnIsPublisherOfficeAdmin(publisher_id);
  // const validated = isOfficeAdmin ? true : false;
  // let adminId = isOfficeAdmin ? publisher_id : null;

  //const transaction = await db.sequelize.transaction();
  try {
    const [result] = await db.sequelize.query(
      `INSERT INTO "dynamic_content"."forums" 
        ("office_id", "sub_area_id", "title", "content", "creation_date", "publisher_id", "admin_id", "event_id", "validated")
        VALUES (:officeId, :subAreaId, :title, :description, CURRENT_TIMESTAMP, :publisher_id, :adminId, :eventId, :validated)
        RETURNING "forum_id"`,
      {
        replacements: {
          officeId,
          subAreaId,
          title,
          description,
          publisher_id,
          adminId,
          eventId,
          validated,
        },
        type: QueryTypes.RAW,
        transaction,
      }
    );

    const forumId = result.forum_id;
    await db.sequelize.query(
      `INSERT INTO "control"."event_forum_access" ("user_id", "forum_id")
        VALUES (:publisher_id, :forumId)`,
      {
        replacements: { publisher_id, forumId },
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

//Function to Get Forum State
async function fnGetForumState(forumId) {
  const result = await db.sequelize.query(
    `SELECT CASE WHEN "validated" = true THEN 'Validated' ELSE 'Pending' END AS "state"
      FROM "dynamic_content"."forums"
      WHERE "forum_id" = :forumId`,
    { replacements: { forumId }, type: QueryTypes.SELECT }
  );

  return result.length ? result[0].state : null;
}

//Procedure to Edit a Forum
async function spEditForum(
  forumId,
  subAreaId = null,
  officeId = null,
  adminId = null,
  title = null,
  content = null,
  eventId = null
) {
  const transaction = await db.sequelize.transaction();
  try {
    const forum = await db.sequelize.query(
      `SELECT "validated" FROM "dynamic_content"."forums" WHERE "forum_id" = :forumId`,
      { replacements: { forumId }, type: QueryTypes.SELECT, transaction }
    );

    if (forum.length && forum[0].validated === false) {
      await db.sequelize.query(
        `UPDATE "dynamic_content"."forums"
          SET
            "sub_area_id" = COALESCE(:subAreaId, "sub_area_id"),
            "office_id" = COALESCE(:officeId, "office_id"),
            "admin_id" = COALESCE(:adminId, "admin_id"),
            "title" = COALESCE(:title, "title"),
            "content" = COALESCE(:content, "content"),
            "event_id" = COALESCE(:eventId, "event_id")
          WHERE "forum_id" = :forumId`,
        {
          replacements: {
            forumId,
            subAreaId,
            officeId,
            adminId,
            title,
            content,
            eventId,
          },
          type: QueryTypes.UPDATE,
          transaction,
        }
      );
    } else {
      console.log("Forum is already validated and cannot be edited.");
    }

    await transaction.commit();
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
}

async function spChangeForumState(forumId, state) {
  const transaction = await db.sequelize.transaction();
  try {
    await db.sequelize.query(
      `UPDATE "dynamic_content"."forums"
      SET "forum_status" = :state
      WHERE "forum_id" = :forumId`,
      { replacements: { forumId, state }, type: QueryTypes.UPDATE, transaction }
    );

    await transaction.commit();
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
}

async function spDeleteForum(forumId) {
  const transaction = await db.sequelize.transaction();
  try {
    await db.sequelize.query(
      `DELETE FROM "dynamic_content"."forums" WHERE "forum_id" = :forumId`,
      { replacements: { forumId }, type: QueryTypes.DELETE, transaction }
    );

    await transaction.commit();
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
}

// async function spGetForum(forumId) {
//   const forum = await db.sequelize.query(
//     `SELECT * FROM "dynamic_content"."forums" WHERE "forum_id" = :forumId`,
//     { replacements: { forumId }, type: QueryTypes.SELECT }
//   );

//   return forum.length ? forum[0] : null;
// }

module.exports = {
  spCreateForum,
  spCreateForumForEvent,
  fnGetForumState,
  spEditForum,
  spChangeForumState,
  spDeleteForum,
  spGetForum,
};
