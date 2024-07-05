const db = require('../../models'); 
const { QueryTypes } = require('sequelize');

async function spAddComment({ parentCommentID = null, contentID, contentType, userID, commentText }) {
  const t = await db.sequelize.transaction();
  try {
    // Insert the new comment
    const [result] = await db.sequelize.query(
      `INSERT INTO "communication"."comments" ("forum_id", "post_id", "publisher_id", "comment_date", "content")
       VALUES (
         CASE WHEN :contentType = 'Forum' THEN :contentID ELSE NULL END,
         CASE WHEN :contentType = 'Post' THEN :contentID ELSE NULL END,
         :userID, CURRENT_TIMESTAMP, :commentText
       ) RETURNING "comment_id"`,
      {
        replacements: { contentID, contentType, userID, commentText },
        type: QueryTypes.INSERT,
        transaction: t
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
        transaction: t
      }
    );

    // If this is a reply to another comment, update the comment_path table
    if (parentCommentID !== null) {
      // Check if the parent comment exists
      const parentCommentExists = await db.sequelize.query(
        `SELECT 1 FROM "communication"."comments" WHERE "comment_id" = :parentCommentID`,
        {
          replacements: { parentCommentID },
          type: QueryTypes.SELECT,
          transaction: t
        }
      );

      if (parentCommentExists.length === 0) {
        throw new Error('Parent comment does not exist.');
      }

      // Insert paths for all ancestors of the parent comment to the new comment
      // Avoid inserting duplicates
      await db.sequelize.query(
        `INSERT INTO "communication"."comment_path" ("ancestor_id", "descendant_id", "depth")
         SELECT "ancestor_id", :newCommentID, "depth" + 1
         FROM "communication"."comment_path"
         WHERE "descendant_id" = :parentCommentID
           AND NOT EXISTS (
               SELECT 1 
               FROM "communication"."comment_path"
               WHERE "ancestor_id" = "communication"."comment_path"."ancestor_id"
                 AND "descendant_id" = :newCommentID
           )`,
        {
          replacements: { newCommentID, parentCommentID },
          type: QueryTypes.INSERT,
          transaction: t
        }
      );

      // Insert the direct link from parent to new comment
      // Avoid inserting duplicates
      await db.sequelize.query(
        `INSERT INTO "communication"."comment_path" ("ancestor_id", "descendant_id", "depth")
         VALUES (:parentCommentID, :newCommentID, 1)
         ON CONFLICT ("ancestor_id", "descendant_id") DO NOTHING`,
        {
          replacements: { parentCommentID, newCommentID },
          type: QueryTypes.INSERT,
          transaction: t
        }
      );
    }

    await t.commit();
  } catch (error) {
    await t.rollback();
    console.error('Error adding comment:', error.message);

    try {
      await db.sequelize.query(
        `EXEC "security"."LogError" :errorMessage`,
        {
          replacements: { errorMessage: error.message },
          type: QueryTypes.RAW
        }
      );
    } catch (logError) {
      console.error('Error logging the error:', logError.message);
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
             0 AS "depth"
         FROM "communication"."comments" c
         WHERE 
             (:contentType = 'Post' AND c."post_id" = :contentID) OR
             (:contentType = 'Forum' AND c."forum_id" = :contentID)
  
         UNION ALL
  
         SELECT 
             c."comment_id",
             c."forum_id",
             c."post_id",
             c."publisher_id",
             c."comment_date",
             c."content",
             ch."depth" + 1
         FROM "communication"."comments" c
         INNER JOIN "communication"."comment_path" cp ON c."comment_id" = cp."descendant_id"
         INNER JOIN "CommentHierarchy" ch ON cp."ancestor_id" = ch."comment_id"
         WHERE cp."depth" > 0
       )
       SELECT 
           "comment_id",
           "forum_id",
           "post_id",
           "publisher_id",
           "comment_date",
           "content",
           "depth"
       FROM "CommentHierarchy"`,
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
module.exports = {
  addComment,
  getCommentTree
};
