const db = require("../../models");
const { QueryTypes } = require("sequelize");
const contentTables = {
  post: "post_id",
  forum: "forum_id",
};
async function spAddComment({
  parentCommentID = null,
  contentID,
  contentType,
  userID,
  commentText,
}) {
  const t = await db.sequelize.transaction();
  try {
    // Insert the new comment
    const [result] = await db.sequelize.query(
      `INSERT INTO "communication"."comments" (
         ${contentType === "Forum" ? '"forum_id"' : '"post_id"'}, 
         "publisher_id", "comment_date", "content"
       ) VALUES (
         :contentID, :userID, CURRENT_TIMESTAMP, :commentText
       ) RETURNING "comment_id"`,
      {
        replacements: { contentID, userID, commentText },
        type: QueryTypes.INSERT,
        transaction: t,
      }
    );

    const newCommentID = result[0].comment_id;

    // Insert the path to the new comment (self-reference with depth 0)
    await db.sequelize.query(
      `INSERT INTO "communication"."comment_path" ("ancestor_id", "descendant_id", "depth")
       VALUES (:newCommentID, :newCommentID, 0)`,
      {
        replacements: { newCommentID },
        type: QueryTypes.INSERT,
        transaction: t,
      }
    );

    // If this is a reply to another comment, update the comment_path table
    if (parentCommentID !== null) {
      // Check if the parent comment exists
      const parentCommentExists = await sequelize.query(
        `SELECT 1 FROM "communication"."comments" WHERE "comment_id" = :parentCommentID`,
        {
          replacements: { parentCommentID },
          type: QueryTypes.SELECT,
          transaction: t,
        }
      );

      if (parentCommentExists.length === 0) {
        throw new Error("Parent comment does not exist.");
      }

      // Insert paths for all ancestors of the parent comment to the new comment
      await db.sequelize.query(
        `INSERT INTO "communication"."comment_path" ("ancestor_id", "descendant_id", "depth")
         SELECT "ancestor_id", :newCommentID, "depth" + 1
         FROM "communication"."comment_path"
         WHERE "descendant_id" = :parentCommentID
         ON CONFLICT ("ancestor_id", "descendant_id") DO NOTHING`,
        {
          replacements: { newCommentID, parentCommentID },
          type: QueryTypes.INSERT,
          transaction: t,
        }
      );

      // Insert the direct link from parent to new comment
      await db.sequelize.query(
        `INSERT INTO "communication"."comment_path" ("ancestor_id", "descendant_id", "depth")
         VALUES (:parentCommentID, :newCommentID, 1)
         ON CONFLICT ("ancestor_id", "descendant_id") DO NOTHING`,
        {
          replacements: { parentCommentID, newCommentID },
          type: QueryTypes.INSERT,
          transaction: t,
        }
      );
    }

    await t.commit();
  } catch (error) {
    await t.rollback();
    console.error("Error adding comment:", error.message);

    try {
      await db.sequelize.query(
        `SELECT security.error_log(:errorMessage, :errorSeverity, :errorState)`,
        {
          replacements: {
            errorMessage: error.message,
            errorSeverity: "ERROR",
            errorState: "ERROR",
          },
          type: QueryTypes.SELECT,
        }
      );
    } catch (logError) {
      console.error("Error logging the error:", logError.message);
    }

    throw error;
  }
}

async function getCommentTree(contentID, contentType) {
  try {
    const results = await db.sequelize.query(
      `WITH RECURSIVE "CommentHierarchy" AS (
        SELECT 
          c."comment_id",
          c."forum_id",
          c."post_id",
          c."publisher_id",
          c."comment_date",
          c."content",
          0 AS "depth",
          ARRAY[c."comment_id"] AS "path"
        FROM "communication"."comments" c
        WHERE 
          c."post_id" = :contentID OR
          c."forum_id" = :contentID

        UNION ALL

        SELECT 
          c."comment_id",
          c."forum_id",
          c."post_id",
          c."publisher_id",
          c."comment_date",
          c."content",
          ch."depth" + 1,
          ch."path" || c."comment_id"
        FROM "communication"."comments" c
        INNER JOIN "communication"."comment_path" cp ON c."comment_id" = cp."descendant_id"
        INNER JOIN "CommentHierarchy" ch ON cp."ancestor_id" = ch."comment_id"
        WHERE NOT c."comment_id" = ANY(ch."path")
      )
      SELECT 
        "comment_id",
        "forum_id",
        "post_id",
        "publisher_id",
        "comment_date",
        "content",
        "depth"
      FROM "CommentHierarchy";
      `,
      {
        replacements: { contentID, contentType },
        type: QueryTypes.SELECT
      }
    );
    return results;
  } catch (error) {
    console.error('Error fetching comment tree:', error);
    throw error;
  }
}

// async function getCommentTree(contentID, contentType) {
//   try {
//     const results = await db.sequelize.query(
//       `WITH RECURSIVE "CommentHierarchy" AS (
//         -- Anchor member: start with the comments directly related to the content (post or forum)
//         SELECT 
//           c."comment_id",
//           c."forum_id",
//           c."post_id",
//           c."publisher_id",
//           c."comment_date",
//           c."content",
//           0 AS "depth"
//         FROM "communication"."comments" c
//         WHERE 
//           (c."post_id" = :contentID AND :contentType = 'Post') OR
//           (c."forum_id" = :contentID AND :contentType = 'Forum')

//         UNION ALL

//         -- Recursive member: join with the comment_path to get the child comments
//         SELECT 
//           c."comment_id",
//           c."forum_id",
//           c."post_id",
//           c."publisher_id",
//           c."comment_date",
//           c."content",
//           ch."depth" + 1
//         FROM "communication"."comments" c
//         INNER JOIN "communication"."comment_path" cp ON c."comment_id" = cp."descendant_id"
//         INNER JOIN "CommentHierarchy" ch ON cp."ancestor_id" = ch."comment_id"
//         WHERE cp."depth" > 0 AND
//           ((c."post_id" = :contentID AND :contentType = 'Post') OR
//            (c."forum_id" = :contentID AND :contentType = 'Forum'))
//       )
//       SELECT 
//         "comment_id",
//         "forum_id",
//         "post_id",
//         "publisher_id",
//         "comment_date",
//         "content",
//         "depth"
//       FROM "CommentHierarchy";
//       `,
//       {
//         replacements: { contentID, contentType },
//         type: QueryTypes.SELECT,
//       }
//     );
//     return results;
//   } catch (error) {
//     console.error("Error fetching comment tree:", error);
//     throw error;
//   }
// }

module.exports = {
  spAddComment,
  getCommentTree,
};
