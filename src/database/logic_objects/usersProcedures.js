const { QueryTypes } = require('sequelize');
const db = require('../../models'); 
const bcrypt = require("bcryptjs");

async function logUserAction(userID, type, description) {
    try {
      await db.sequelize.transaction(async (transaction) => {
        await db.sequelize.query(
          `INSERT INTO "user_interactions"."user_actions_log" (user_id, action_type, action_description, action_date) VALUES (:userID, :type, :description, CURRENT_TIMESTAMP)`,
          {
            replacements: { userID, type, description },
            type: QueryTypes.INSERT,
            transaction
          }
        );
      });
    } catch (error) {
      console.error('Error logging user action:', error);
      throw error;
    }
}

async function getUserPreferences(userID) {
    try {
      const results = await db.sequelize.query(
        `SELECT 
            up.user_id, 
            up.areas, 
            up.sub_areas, 
            a.title AS "AreaTitle", 
            sa.title AS "SubAreaTitle", 
            up."receive_notifications"
          FROM "user_interactions"."user_pref" up
          LEFT JOIN "static_content"."area" a ON up.areas IS NOT NULL AND EXISTS (
              SELECT 1 
              FROM OPENJSON(up.areas) 
              WHERE value = CAST(a."area_id" AS NVARCHAR)
          )
          LEFT JOIN "static_content"."sub_area" sa ON up.sub_areas IS NOT NULL AND EXISTS (
              SELECT 1 
              FROM OPENJSON(up.sub_areas) 
              WHERE value = CAST(sa."sub_area_id" AS NVARCHAR)
          )
          WHERE up.user_id = :userID`,
        {
          replacements: { userID },
          type: QueryTypes.SELECT
        }
      );
      return results;
    } catch (error) {
      console.error('Error fetching user preferences:', error);
      throw error;
    }
}

  async function updateUserPreferences(userID, preferredlanguage_id, preferredAreas, preferredSubAreas, receiveNotifications) {
    try {
      await db.sequelize.transaction(async (transaction) => {
        if (preferredlanguage_id !== null) {
          await db.sequelize.query(
            `UPDATE "user_interactions"."user_pref"
            SET "language_id" = :preferredlanguage_id
            WHERE "user_id" = :userID`,
            {
              replacements: { userID, preferredlanguage_id },
              type: QueryTypes.UPDATE,
              transaction
            }
          );
        }
  
        if (preferredAreas !== null) {
          await db.sequelize.query(
            `UPDATE "user_interactions"."user_pref"
            SET "areas" = :preferredAreas
            WHERE "user_id" = :userID`,
            {
              replacements: { userID, preferredAreas },
              type: QueryTypes.UPDATE,
              transaction
            }
          );
        }
  
        if (preferredSubAreas !== null) {
          await db.sequelize.query(
            `UPDATE "user_interactions"."user_pref"
            SET "sub_areas" = :preferredSubAreas
            WHERE "user_id" = :userID`,
            {
              replacements: { userID, preferredSubAreas },
              type: QueryTypes.UPDATE,
              transaction
            }
          );
        }
  
        if (receiveNotifications !== null) {
          await db.sequelize.query(
            `UPDATE "user_interactions"."user_pref"
            SET "receive_notifications" = :receiveNotifications
            WHERE "user_id" = :userID`,
            {
              replacements: { userID, receiveNotifications },
              type: QueryTypes.UPDATE,
              transaction
            }
          );
        }
  
        await logUserAction(userID, 'User Preferences', 'User changed preferences');
      });
    } catch (error) {
      console.error('Error updating user preferences:', error);
      throw error;
    }
}

async function updateAccessOnLogin(userID) {
    try {
      await db.sequelize.transaction(async (transaction) => {
        await db.sequelize.query(
          `UPDATE "hr"."users"
          SET "last_access" = CURRENT_TIMESTAMP
          WHERE "user_id" = :userID`,
          {
            replacements: { userID },
            type: QueryTypes.UPDATE,
            transaction
          }
        );
  
        await logUserAction(userID, 'Login', 'User logged into the application');
      });
    } catch (error) {
      console.error('Error updating last access on login:', error);
      throw error;
    }
}

async function getUserRole(userID) {
    try {
      const result = await db.sequelize.query(
        `SELECT p."role_name"
        FROM "hr"."users" u
        JOIN "security"."acc_permissions" p ON u."role_id" = p."role_id"
        WHERE u."user_id" = :userID
        `,
        {
          replacements: { userID },
          type: QueryTypes.SELECT
        }
      );
      return result[0] ? result[0].role_name : null;
    } catch (error) {
      console.error('Error getting user role:', error);
      throw error;
    }
}

async function getUserByRole(role) {
  try {
    const result = await db.sequelize.transaction(async (transaction) => {
      return await db.sequelize.query(
        `SELECT u."user_id", (u."first_name" || ' ' || u."last_name") AS "name"
         FROM "hr"."users" u
         JOIN "security"."acc_permissions" p ON u."role_id" = p."role_id"
         WHERE p."role_name" = :role`,
        {
          replacements: { role },
          type: QueryTypes.SELECT,
          transaction
        }
      );
    });
    return result;
  } catch (error) {
    console.error('Error getting user by role:', error);
    throw error;
  }
}


async function addBookmark(userID, contentID, contentType) {
    try {
      await db.sequelize.transaction(async (transaction) => {
        const [results] = await db.sequelize.query(
          `SELECT 1 FROM "user_interactions"."bookmarks"
          WHERE "user_id" = :userID AND "content_id" = :contentID AND "content_type" = :contentType`,
          {
            replacements: { userID, contentID, contentType },
            type: QueryTypes.SELECT,
            transaction
          }
        );
  
        if (!results) {
          await db.sequelize.query(
            `INSERT INTO "user_interactions"."bookmarks" ("user_id", "content_id", "content_type", "bookmark_date")
            VALUES (:userID, :contentID, :contentType, CURRENT_TIMESTAMP)`,
            {
              replacements: { userID, contentID, contentType },
              type: QueryTypes.INSERT,
              transaction
            }
          );
  
          await logUserAction(userID, 'Bookmark', 'User added bookmark');
        } else {
          console.log('Content already bookmarked.');
        }
      });
    } catch (error) {
      console.error('Error adding bookmark:', error);
      throw error;
    }
}

async function removeBookmark(userID, contentID, contentType) {
    try {
      await db.sequelize.transaction(async (transaction) => {
        const [results] = await db.sequelize.query(
          `SELECT 1 FROM "user_interactions"."bookmarks"
          WHERE "user_id" = :userID AND "content_id" = :contentID AND "content_type" = :contentType`,
          {
            replacements: { userID, contentID, contentType },
            type: QueryTypes.SELECT,
            transaction
          }
        );
  
        if (results) {
          await db.sequelize.query(
            `DELETE FROM "user_interactions"."bookmarks"
            WHERE "user_id" = :userID AND "content_id" = :contentID AND "content_type" = :contentType`,
            {
              replacements: { userID, contentID, contentType },
              type: QueryTypes.DELETE,
              transaction
            }
          );
  
          await logUserAction(userID, 'Bookmark', 'User removed bookmark');
          console.log('Bookmark removed successfully.');
        } else {
          console.log('Bookmark does not exist.');
        }
      });
    } catch (error) {
      console.error('Error removing bookmark:', error);
      throw error;
    }
}

async function getUserBookmarks(userID) {
    try {
      const results = await db.sequelize.query(
        `SELECT 
          ub."user_id",
          ub."content_id",
          ub."content_type",
          ub."bookmark_date",
          p."title" AS "PostTitle",
          p."content" AS "PostContent",
          e."name" AS "EventName",
          e."description" AS "EventDescription",
          f."title" AS "ForumTitle",
          f."content" AS "ForumContent"
        FROM "user_interactions"."bookmarks" ub
        LEFT JOIN "dynamic_content"."posts" p ON ub."content_id" = p."post_id" AND ub."content_type" = 'Post'
        LEFT JOIN "dynamic_content"."events" e ON ub."content_id" = e."event_id" AND ub."content_type" = 'Event'
        LEFT JOIN "dynamic_content"."forums" f ON ub."content_id" = f."forum_id" AND ub."content_type" = 'Forum'
        WHERE ub."user_id" = :userID`,
        {
          replacements: { userID },
          type: QueryTypes.SELECT
        }
      );
      return results;
    } catch (error) {
      console.error('Error fetching user bookmarks:', error);
      throw error;
    }
}

async function sp_verifyUser(userID) {
    try {
      const result = await db.sequelize.query(
        `SELECT u."user_id", a."account_status", a."account_restriction"
        FROM "hr"."users" u
        JOIN "security"."user_account_details" a ON u."user_id" = a."user_id"
        WHERE u."user_id" = :userID`,
        {
          replacements: { userID },
          type: QueryTypes.SELECT
        }
      );
      return result[0];
    } catch (error) {
      console.error('Error verifying user:', error);
      throw error;
    }
};

async function sp_updateLastAccess(userID) {
    try {
      await db.sequelize.transaction(async (transaction) => {
        await db.sequelize.query(
          `UPDATE "hr"."users"
          SET "last_access" = CURRENT_TIMESTAMP
          WHERE "user_id" = :userID`,
          {
            replacements: { userID },
            type: QueryTypes.UPDATE,
            transaction
          }
        );
      }
      );
    }
    catch (error) {
      console.error('Error updating last access:', error);
      throw error;
    }
}

async function updateAccStatus(userID, accountStatus) {
    try {
      await db.sequelize.transaction(async (transaction) => {
        await db.sequelize.query(
          `UPDATE "security"."user_account_details"
          SET "account_status" = :accountStatus
          WHERE "user_id" = :userID`,
          {
            replacements: { userID, accountStatus },
            type: QueryTypes.UPDATE,
            transaction
          }
        );
      });
    } catch (error) {
      console.error('Error updating account status:', error);
      throw error;
    }
};

async function createUserPreferences(userID, areas=null, subAreas=null, receiveNotifications=null, languageID = null, additionalPreferences = null) {
  try {
    await db.sequelize.transaction(async (transaction) => {
      // Check if the user preferences already exist
      const [results] = await db.sequelize.query(
        `SELECT 1 FROM "user_interactions"."user_pref" WHERE "user_id" = :userID`,
        {
          replacements: { userID },
          type: QueryTypes.SELECT,
          transaction
        }
      );

      if (!results) {
        // Insert the new user preferences
        await db.sequelize.query(
          `INSERT INTO "user_interactions"."user_pref" (
            "user_id", "areas", "sub_areas", "receive_notifications", "language_id", "additional_preferences"
          ) VALUES (
            :userID, :areas, :subAreas, :receiveNotifications, :languageID, :additionalPreferences
          )`,
          {
            replacements: { userID, areas, subAreas, receiveNotifications, languageID, additionalPreferences },
            type: QueryTypes.INSERT,
            transaction
          }
        );

        // Log the user action
        await logUserAction(userID, 'User Preferences', 'User Created preferences');
        // await db.sequelize.query(
        //   `EXEC "user_interactions"."spLogUserAction" :userID, 'Created User Preferences', 'User Created preferences'`,
        //   {
        //     replacements: { userID },
        //     type: QueryTypes.RAW,
        //     transaction
        //   }
        // );
      } else {
        console.log('User preferences already exist.');
      }
    });
  } catch (error) {
    console.error('Error creating user preferences:', error);
    throw error;
  }
}
async function getUsersToValidate() {
  try {
    const results = await db.sequelize.query(
      `SELECT *
      FROM "hr"."users" u
      JOIN "security".user_account_details uad on u.user_id = uad.user_id 
      WHERE uad.account_status = false;`,
      {
        type: QueryTypes.SELECT
      }
    );
    return results;
  } catch (error) {
    console.error('Error fetching users to validate:', error);
    throw error;
  }
};

async function updateProfile(user, firstName, lastName, profile_pic) {
  try {
    await db.sequelize.transaction(async (transaction) => {
      await db.sequelize.query(
        `UPDATE "hr"."users"
        SET
          "first_name" = COALESCE(:firstName, "first_name"),
          "last_name" = COALESCE(:lastName, "last_name"),
          "profile_pic" = COALESCE(:profile_pic, "profile_pic")
        WHERE "user_id" = :user`,
        {
          replacements: { 
            user, 
            firstName: firstName || null, 
            lastName: lastName || null, 
            profile_pic: profile_pic || null 
          },
          type: QueryTypes.UPDATE,
          transaction
        }
      );
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    throw error;
  }
};

async function getUserPosts(userID) {
  try {
    const results = await db.sequelize.query(
      `SELECT 
        p."post_id" AS "ContentID",
        'Post' AS "ContentType",
        p."title" AS "Title",
        p."content" AS "Content",
        p."creation_date" AS "CreationDate",
        p."validated" AS "Validated"
      FROM "dynamic_content"."posts" p
      WHERE p."publisher_id" = :userID

      UNION ALL

      SELECT 
        f."forum_id" AS "ContentID",
        'Forum' AS "ContentType",
        f."title" AS "Title",
        f."content" AS "Content",
        f."creation_date" AS "CreationDate",
        f."validated" AS "Validated"
      FROM "dynamic_content"."forums" f
      WHERE f."publisher_id" = :userID

      UNION ALL

      SELECT 
        e."event_id" AS "ContentID",
        'Event' AS "ContentType",
        e."name" AS "Title",
        e."description" AS "Content",
        e."creation_date" AS "CreationDate",
        e."validated" AS "Validated"
      FROM "dynamic_content"."events" e
      WHERE e."publisher_id" = :userID

      ORDER BY "CreationDate" DESC`,
      {
        replacements: { userID },
        type: QueryTypes.SELECT
      }
    );
    return results;
  } catch (error) {
    console.error('Error fetching user-created content:', error);
    throw error;
  }
}

async function getUserRegisteredEvents(userID) {
  try {
    const results = await db.sequelize.query(
      `SELECT 
        e."event_id",
        e."name" AS "EventName",
        e."description" AS "EventDescription",
        e."event_date" AS "Date",
        e."start_time" AS "Start Time",
        e."end_time" AS "End Time",
        e."event_location" AS "Location",
        p."entry_date" AS "RegistrationDate"
      FROM "control"."participation" p
      JOIN "dynamic_content"."events" e ON p."event_id" = e."event_id"
      WHERE p."user_id" = :userID
      ORDER BY e."event_date" DESC`,
      {
        replacements: { userID },
        type: QueryTypes.SELECT
      }
    );
    return results;
  } catch (error) {
    console.error('Error fetching user registered events:', error);
    throw error;
  }
}

async function updateUserPassword(user, password) {

  const hashedPassword = await bcrypt.hash(password, 12);

  try{
    await db.sequelize.transaction(async (transaction) => {
      await db.sequelize.query(
        `UPDATE "hr"."users"
        SET "hashed_password" = :hashedPassword
        WHERE "user_id" = :user`,
        {
          replacements: { user, hashedPassword },
          type: QueryTypes.UPDATE,
          transaction
        }
      );
    });
  }catch(error){
    console.error('Error updating password:', error);
    throw error;
  }
}


  

  
  module.exports = {
    logUserAction,
    getUserPreferences,
    updateUserPreferences,
    updateAccessOnLogin,
    getUserRole,
    getUserByRole,
    addBookmark,   
    removeBookmark, 
    getUserBookmarks,
    sp_verifyUser,
    sp_updateLastAccess,
    updateAccStatus,
    createUserPreferences,
    getUsersToValidate,
    updateProfile,
    updateUserPassword,
    getUserPosts,
    getUserRegisteredEvents,
}