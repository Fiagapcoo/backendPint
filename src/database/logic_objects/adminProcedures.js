const { QueryTypes } = require('sequelize');
const db = require('../../models'); 
const {logError} = require('./generalHelpers');

async function getUserEngagementMetrics() {
    try {
      const results = await db.sequelize.query(
        `SELECT action_type, COUNT(*) AS "action_count"
         FROM "user_interactions"."user_actions_log"
         GROUP BY action_type`,
        {
          type: QueryTypes.SELECT
        }
      );
      return results;
    } catch (error) {
      console.error('Error fetching user engagement metrics:', error);
      throw error;
    }
}

async function getContentValidationStatusByadmin(adminID) {
    try {
      const center_id = await db.sequelize.query(
        `SELECT oa."office_id"
         FROM "centers"."office_admins" oa
         WHERE oa."manager_id" = :adminID`,
        {
          replacements: { adminID },
          type: QueryTypes.SELECT
        }
      );
  
      if (!center_id.length) {
        console.log('Invalid adminID or adminID not associated with any Center');
        return [];
      }
  
      const results = await db.sequelize.query(
        `SELECT cvs."content_type", cvs."content_status", COUNT(*) AS "content_count"
         FROM "admin"."content_validation_status" cvs
         INNER JOIN "dynamic_content"."posts" p ON cvs."content_real_id" = p."post_id" AND cvs."content_type" = 'Post' AND p."office_id" = :center_id
         GROUP BY cvs."content_type", cvs."content_status"
         UNION
         SELECT cvs."content_type", cvs."content_status", COUNT(*) AS "content_count"
         FROM "admin"."content_validation_status" cvs
         INNER JOIN "dynamic_content"."events" e ON cvs."content_real_id" = e."event_id" AND cvs."content_type" = 'Event' AND e."office_id" = :center_id
         GROUP BY cvs."content_type", cvs."content_status"
         UNION
         SELECT cvs."content_type", cvs."content_status", COUNT(*) AS "content_count"
         FROM "admin"."content_validation_status" cvs
         INNER JOIN "dynamic_content"."forums" f ON cvs."content_real_id" = f."forum_id" AND cvs."content_type" = 'Forum' AND f."office_id" = :center_id
         GROUP BY cvs."content_type", cvs."content_status"`,
        {
          replacements: { center_id: center_id[0].office_id },
          type: QueryTypes.SELECT
        }
      );
      return results;
    } catch (error) {
      console.error('Error fetching content validation status by admin:', error);
      throw error;
    }
}

async function getContentValidationStatus() {
    try {
      const results = await db.sequelize.query(
        `SELECT "content_type", "content_status", COUNT(*) AS "content_count"
         FROM "admin"."content_validation_status"
         GROUP BY "content_type", "content_status"`,
        {
          type: QueryTypes.SELECT
        }
      );
      return results;
    } catch (error) {
      console.error('Error fetching content validation status:', error);
      throw error;
    }
}

async function getActiveDiscussions() {
    try {
      const results = await db.sequelize.query(
        `SELECT d."forum_id", f."title", d."last_activity_date", d."active_participants"
         FROM "admin"."active_discussions" d
         JOIN "dynamic_content"."forums" f ON d."forum_id" = f."forum_id"
         ORDER BY d."last_activity_date" DESC`,
        {
          type: QueryTypes.SELECT
        }
      );
      return results;
    } catch (error) {
      console.error('Error fetching active discussions:', error);
      throw error;
    }
}


async function validateContent(contentType,contentID, adminID) {
  const transaction = await db.sequelize.transaction();
  try{
        const officecenter_id = await sequelize.query(
          `SELECT "office_id"
           FROM "centers"."office_admins"
           WHERE "manager_id" = :adminID`,
          {
            replacements: { adminID },
            type: QueryTypes.SELECT,
            transaction
          }
        );
  
        if (!officecenter_id.length) {
          console.log('Unauthorized validation attempt.');
          throw new Error('Unauthorized validation attempt.');
        }
  
        const isAuthorized = await db.sequelize.query(
          `SELECT 1
           FROM "dynamic_content"."posts" p
           JOIN "centers"."office_admins" ro ON p."office_id" = ro."office_id"
           WHERE p."post_id" = :contentID AND ro."office_id" = :officecenter_id`,
          {
            replacements: { contentID, officecenter_id: officecenter_id[0].office_id },
            type: QueryTypes.SELECT,
            transaction
          }
        );
  
        if (!isAuthorized.length) {
          console.log('Unauthorized validation attempt.');
          throw new Error('Unauthorized validation attempt.');
        }
  
        await db.sequelize.query(
          `UPDATE "admin"."content_validation_status"
           SET "content_status" = 'Approved', "validation_date" = CURRENT_TIMESTAMP, "validator_id" = :adminID
           WHERE "content_id" = :contentID`,
          {
            replacements: { contentID, adminID },
            type: QueryTypes.UPDATE,
            transaction
          }
        )
          const table = contentTables[contentType];
          if (!table) {
              throw new Error('Invalid content type');
          }

          await db.sequelize.query(
              `UPDATE "dynamic_content"."${table}"
          SET "validated" = true
          WHERE "${contentType.toLowerCase()}_id" = :contentID`,
              { replacements: { contentcontentIDId }, type: QueryTypes.UPDATE, transaction }
          );
          
      ;
      await transaction.commit();
    } catch (error) {
        await transaction.rollback();
        console.error('Error validating content:', error);
        throw error;
    }
}


async function rejectContent(contentType, contentID, adminID) {
  const transaction = await db.sequelize.transaction();
  try {
      const validContentTypes = ['Post', 'Event', 'Forum'];
      if (!validContentTypes.includes(contentType)) {
          throw new Error('Invalid ContentType. Only "Post", "Event", and "Forum" are allowed.');
      }

      await db.sequelize.query(
          `UPDATE "admin"."content_validation_status"
      SET "validator_id" = :adminID, "validation_date" = CURRENT_TIMESTAMP, "content_status" = 'Rejected'
      WHERE "content_real_id" = :contentID AND "content_type" = :contentType`,
          { replacements: { contentID, contentType, adminID }, type: QueryTypes.UPDATE, transaction }
      );

      await transaction.commit();
  } catch (error) {
      await transaction.rollback();
      throw error;
  }
}

async function getActiveWarnings() {
    try {
      const results = await db.sequelize.query(
        `SELECT "warning_id", "warning_level", "description", "state", "creation_date", "admin_id", "office_id"
         FROM "control"."warnings"
         WHERE "state" = 1`,
        {
          type: QueryTypes.SELECT
        }
      );
      return results;
    } catch (error) {
      console.error('Error fetching active warnings:', error);
      throw error;
    }
}

async function getContentCenterToBeValidated(center_id) {
    try {
      const results = await db.sequelize.query(
        `SELECT
          cvs."content_type",
          cvs."content_status",
          cvs."content_real_id",
          cvs."validation_date",
          cvs."validator_id"
         FROM "admin"."content_validation_status" cvs
         JOIN "dynamic_content"."posts" p ON cvs."content_type" = 'Post' AND cvs."content_real_id" = p."post_id" AND p."office_id" = :center_id
         WHERE cvs."content_status" = 'Pending'
         UNION ALL
         SELECT
          cvs."content_type",
          cvs."content_status",
          cvs."content_real_id",
          cvs."validation_date",
          cvs."validator_id"
         FROM "admin"."content_validation_status" cvs
         JOIN "dynamic_content"."events" e ON cvs."content_type" = 'Event' AND cvs."content_real_id" = e."event_id" AND e."office_id" = :center_id
         WHERE cvs."content_status" = 'Pending'
         UNION ALL
         SELECT
          cvs."content_type",
          cvs."content_status",
          cvs."content_real_id",
          cvs."validation_date",
          cvs."validator_id"
         FROM "admin"."content_validation_status" cvs
         JOIN "dynamic_content"."forums" f ON cvs."content_type" = 'Forum' AND cvs."content_real_id" = f."forum_id" AND f."office_id" = :center_id
         WHERE cvs."content_status" = 'Pending'`,
        {
          replacements: { center_id },
          type: QueryTypes.SELECT
        }
      );
      return results;
    } catch (error) {
      console.error('Error fetching content center to be validated:', error);
      throw error;
    }
}
  

async function createCenter(city, id) {
  try {
      await db.sequelize.query(
          `INSERT INTO "centers"."offices" ("city", "id")
           VALUES (:city, :id)`,
          {
              replacements: { city, id },
              type: QueryTypes.INSERT
          }
      );
  } catch (error) {
      console.error('Error creating center:', error);
      throw error;
  }
}

async function deleteCenter(center_id) {
    try {
      await db.sequelize.query(
        `DELETE FROM "centers"."offices"
         WHERE "office_id" = :center_id`,
        {
          replacements: { center_id },
          type: QueryTypes.DELETE
        }
      );
    } catch (error) {
      console.error('Error deleting center:', error);
      throw error;
    }
}

async function spValidateContentHELPER(contentType, contentID, adminID) {
  const transaction = await db.sequelize.transaction();
  try {
    const newDate = new Date();

    // Update CONTENT_VALIDATION_STATUS
    await db.sequelize.query(
      `UPDATE "admin"."content_validation_status"
       SET "validator_id" = :adminID,
           "validation_date" = :newDate,
           "content_status" = 'Approved'
       WHERE "content_real_id" = :contentID AND "content_type" = :contentType`,
      {
        replacements: { adminID, newDate, contentID, contentType },
        type: QueryTypes.UPDATE,
        transaction
      }
    );

    // Validate content based on the content type
    if (contentType === 'Post') {
      await db.sequelize.query(
        `UPDATE "dynamic_content"."posts"
         SET "validated" = 1, "admin_id" = :adminID
         WHERE "post_id" = :contentID`,
        {
          replacements: { adminID, contentID },
          type: QueryTypes.UPDATE,
          transaction
        }
      );
    } else if (contentType === 'Event') {
      await db.sequelize.query(
        `UPDATE "dynamic_content"."events"
         SET "validated" = 1, "admin_id" = :adminID
         WHERE "event_id" = :contentID`,
        {
          replacements: { adminID, contentID },
          type: QueryTypes.UPDATE,
          transaction
        }
      );
    } else if (contentType === 'Forum') {
      await db.sequelize.query(
        `UPDATE "dynamic_content"."forums"
         SET "validated" = 1, "admin_id" = :adminID
         WHERE "forum_id" = :contentID`,
        {
          replacements: { adminID, contentID },
          type: QueryTypes.UPDATE,
          transaction
        }
      );
    } else {
      throw new Error('Invalid ContentType. Only "Post", "Event", and "Forum" are allowed.');
    }

    await transaction.commit();
  }catch (error) {
    if (transaction) await transaction.rollback();
    await logError(error.message, error.severity || 16, error.state || 1);
    throw error;
    }
  }

async function spValidateContent(contentID, contentType, validatorID) {
  const transaction = await db.sequelize.transaction();
  try {
    // Fetch the OfficeCenterID for the given validatorID
    const result = await db.sequelize.query(
      `SELECT "office_id" FROM "centers"."office_admins" WHERE "manager_id" = :validatorID`,
      {
        replacements: { validatorID },
        type: QueryTypes.SELECT,
        transaction
      }
    );

    if (!result.length) {
      throw new Error('Validator not found.');
    }

    const officeCenterID = result[0].office_id;

    if (officeCenterID === 0) {
      // Admin has permission to validate content globally
      await spValidateContentHELPER(contentID, contentType, validatorID);
    } else {
      // Check if the content belongs to the admin's designated center
      const isAuthorized = await db.sequelize.query(
        `SELECT 1
         FROM "dynamic_content"."posts" p
         JOIN "centers"."office_admins" ro ON p."office_id" = ro."office_id"
         WHERE p."post_id" = :contentID AND ro."office_id" = :officeCenterID`,
        {
          replacements: { contentID, officeCenterID },
          type: QueryTypes.SELECT,
          transaction
        }
      );

      if (!isAuthorized.length) {
        throw new Error('Unauthorized validation attempt.');
      }

      await spValidateContentHELPER(contentID, contentType, validatorID);
    }

    await transaction.commit();
  } catch (error) {
    await transaction.rollback();
    await logError(error.message, error.severity || 16, error.state || 1);
    throw error;
  }
}

async function spCreateWarning(description, severity, createdBy, officeId = 0) {
    const transaction = await db.sequelize.transaction();
    try {
        // Fetch the office center ID
        const officeCenterResult = await db.sequelize.query(
            `SELECT "office_id"
             FROM "centers"."office_admins"
             WHERE "manager_id" = :createdBy`,
            { replacements: { createdBy }, type: QueryTypes.SELECT, transaction }
        );

        if (officeCenterResult.length === 0) {
            throw new Error('Office center not found for the admin.');
        }

        const officeCenterId = officeCenterResult[0].office_id;

        if (officeCenterId === 0 || officeId === officeCenterId) {
            // Insert the new warning
            await db.sequelize.query(
                `INSERT INTO "control"."warnings" ("description", "warning_level", "admin_id", "office_id")
                 VALUES (:description, :severity, :createdBy, :officeId)`,
                { replacements: { description, severity, createdBy, officeId }, type: QueryTypes.INSERT, transaction }
            );
        } else {
            throw new Error('Unauthorized attempt.');
        }

        await transaction.commit();
    } catch (error) {
        if (transaction) await transaction.rollback();

        console.error('Error creating warning:', error.message);

        throw error;
    }
}

async function spMakeWarningInactive(warningId, adminId, officeId) {
    const transaction = await db.sequelize.transaction();
    try {
        // Fetch the office center ID
        const officeCenterResult = await db.sequelize.query(
            `SELECT "office_id" 
             FROM "centers"."office_admins" 
             WHERE "manager_id" = :adminId`,
            { replacements: { adminId }, type: QueryTypes.SELECT, transaction }
        );

        if (officeCenterResult.length === 0) {
            throw new Error('Office center not found for the admin.');
        }

        const officeCenterId = officeCenterResult[0].office_id;

        if (officeCenterId === 0 || officeId === officeCenterId) {
            // Update the warning to set it inactive
            await db.sequelize.query(
                `UPDATE "control"."warnings"
                 SET "state" = 0
                 WHERE "warning_id" = :warningId`,
                { replacements: { warningId }, type: QueryTypes.UPDATE, transaction }
            );
        } else {
            throw new Error('Unauthorized attempt.');
        }

        await transaction.commit();
    } catch (error) {
        if (transaction) await transaction.rollback();

        console.error('Error making warning inactive:', error.message);

        throw error;
    }
}

module.exports = {
    getUserEngagementMetrics,
    getContentValidationStatusByadmin,
    getContentValidationStatus,
    getActiveDiscussions,
    validateContent,
    rejectContent,
    getActiveWarnings,
    getContentCenterToBeValidated,
    createCenter,
    deleteCenter,
    spValidateContent,
    spCreateWarning,
    spMakeWarningInactive
    
};