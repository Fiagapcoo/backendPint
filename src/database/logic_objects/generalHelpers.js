const { QueryTypes } = require("sequelize");
const db = require("../../models");

//Procedure to Validate Content
/*
async function spValidateContent(contentType, contentId, adminId) {
    const transaction = await db.sequelize.transaction();
    try {
        
        await db.sequelize.query(
            `UPDATE "admin"."content_validation_status"
        SET "validator_id" = :adminId, "validation_date" = CURRENT_TIMESTAMP, "content_status" = 'Approved'
        WHERE "content_real_id" = :contentId AND "content_type" = :contentType`,
            { replacements: { contentId, contentType, adminId }, type: QueryTypes.UPDATE, transaction }
        );

        const contentTables = {
            Post: 'posts',
            Event: 'events',
            Forum: 'forums'
        };

        const table = contentTables[contentType];
        if (!table) {
            throw new Error('Invalid content type');
        }

        await db.sequelize.query(
            `UPDATE "dynamic_content"."${table}"
        SET "validated" = true
        WHERE "${contentType.toLowerCase()}_id" = :contentId`,
            { replacements: { contentId }, type: QueryTypes.UPDATE, transaction }
        );

        await transaction.commit();
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
}
*/

//Procedure to Insert a New Rating/Evaluation
async function spInsertEvaluation(
  contentType,
  contentId,
  criticId,
  evaluation
) {
  const transaction = await db.sequelize.transaction();
  try {
    const validContentTypes = ["Post", "Event"];
    if (!validContentTypes.includes(contentType)) {
      throw new Error(
        'Invalid ContentType. Only "Post" and "Event" are allowed.'
      );
    }

    const table = contentType === "Post" ? "posts" : "events";

    await db.sequelize.query(
      `INSERT INTO "dynamic_content"."ratings" ("${table}_id", "critic_id", "evaluation_date", "evaluation")
        VALUES (:contentId, :criticId, CURRENT_TIMESTAMP, :evaluation)`,
      {
        replacements: { contentId, criticId, evaluation },
        type: QueryTypes.INSERT,
        transaction,
      }
    );

    await transaction.commit();
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
}

//Function to Calculate New Average Rating
// async function fnReverseRating(avgRating, numOfRatings, newRating) {
//     const totalOfRatings = avgRating * numOfRatings + newRating;
//     const newAvgRating = totalOfRatings / (numOfRatings + 1);
//     return newAvgRating;
// }

//Trigger to Update Average Score on Content
// async function trgUpdateAverageScore() {
//     const transaction = await db.sequelize.transaction();
//     try {
//         const insertedRows = await db.sequelize.query(
//             `SELECT "event_id", "post_id"
//         FROM INSERTED`,
//             { type: QueryTypes.SELECT, transaction }
//         );

//         for (const row of insertedRows) {
//             const { event_id: eventId, post_id: postId } = row;
//             const table = postId ? 'post_id' : 'event_id';
//             const contentId = postId || eventId;

//             const [currentAvgScore] = await sequelize.query(
//                 `SELECT "score", "num_of_evals"
//           FROM "dynamic_content"."scores"
//           WHERE "${table}" = :contentId`,
//                 { replacements: { contentId }, type: QueryTypes.SELECT, transaction }
//             );

//             if (currentAvgScore) {
//                 const newAvgRating = await fnReverseRating(currentAvgScore.score, currentAvgScore.num_of_evals, newRating);

//                 await db.sequelize.query(
//                     `UPDATE "dynamic_content"."scores"
//             SET "score" = :newAvgRating, "num_of_evals" = "num_of_evals" + 1
//             WHERE "${table}" = :contentId`,
//                     { replacements: { newAvgRating, contentId }, type: QueryTypes.UPDATE, transaction }
//                 );
//             }
//         }

//         await transaction.commit();
//     } catch (error) {
//         await transaction.rollback();
//         throw error;
//     }
// }

async function fnIsPublisherOfficeAdmin(publisherID, officeID) {
  // Fetch the OfficeCenterID for the given publisherID, in case he is a admin
  const offcAdmin = await db.sequelize.query(
    `SELECT "office_id" FROM "centers"."office_admins" WHERE "manager_id" = :publisherID`,
    {
      replacements: { publisherID },
      type: QueryTypes.SELECT,
      transaction,
    }
  );
  //check wheter it got back an office, eg. the publisher is an admin. If not return false;
  if (offcAdmin.length) {
    const officeCenterID = offcAdmin[0].office_id;

    if ( officeCenterID === 0 || officeCenterID == officeID ) {
      return true;
    }
  }
  return false;

//   const result = await db.sequelize.query(
//     `SELECT EXISTS (SELECT 1 FROM "centers"."office_admins" WHERE "manager_id" = :publisherID AND "office_id" = :officeID) AS "exists"`,
//     {
//       replacements: { publisherID, officeID },
//       type: QueryTypes.SELECT,
//     }
//   );

//   return result[0].exists ? true : false;
}

const logError = async (errorMessage, errorSeverity, errorState) => {
  try {
    await db.sequelize.query(
      `INSERT INTO "security"."error_log" ("error_message", "error_severity", "error_state", "error_time")
         VALUES (:errorMessage, :errorSeverity, :errorState, NOW())`,
      {
        replacements: { errorMessage, errorSeverity, errorState },
        type: QueryTypes.INSERT,
      }
    );

    throw new Error(errorMessage);
  } catch (error) {
    throw error;
  }
};

module.exports = {
  //spValidateContent,
  //spRejectContent,
  spInsertEvaluation,
  // fnReverseRating,
  // trgUpdateAverageScore,
  fnIsPublisherOfficeAdmin,
  logError,
};
