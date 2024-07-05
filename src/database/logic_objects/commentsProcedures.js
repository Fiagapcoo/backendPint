const db = require('../../models'); 
const { QueryTypes } = require('sequelize');

async function addComment({ parentCommentID = null, contentID, contentType, userID, commentText }) {
  const t = await db.sequelize.transaction();
  try {
    // Insert the new comment
    const [newComment] = await db.sequelize.query(
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

    const newCommentID = newComment.comment_id;

    // Insert the path to the new comment (self-reference with deph 0)
    await db.sequelize.query(
      `INSERT INTO "communication"."comment_path" ("ancestor_id", "descendant_id", "deph")
       VALUES (:newCommentID, :newCommentID, 0)`,
      {
        replacements: { newCommentID },
        type: QueryTypes.INSERT,
        transaction: t
      }
    );

    // If this is a reply to another comment, update the comment_path table
    if (parentCommentID !== null) {
      // Insert paths for all ancestors of the parent comment to the new comment
      await db.sequelize.query(
        `INSERT INTO "communication"."comment_path" ("ancestor_id", "descendant_id", "deph")
         SELECT "ancestor_id", :newCommentID, "deph" + 1
         FROM "communication"."comment_path"
         WHERE "descendant_id" = :parentCommentID`,
        {
          replacements: { newCommentID, parentCommentID },
          type: QueryTypes.INSERT,
          transaction: t
        }
      );

      // Insert the direct link from parent to new comment
      await db.sequelize.query(
        `INSERT INTO "communication"."comment_path" ("ancestor_id", "descendant_id", "deph")
         VALUES (:parentCommentID, :newCommentID, 1)`,
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
    console.error('Error adding comment:', error);
    await db.sequelize.query(
      `EXEC "security"."error_log" :errorMessage`,
      {
        replacements: { errorMessage: error.message },
        type: QueryTypes.RAW
      }
    );
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
