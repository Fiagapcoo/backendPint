const { QueryTypes } = require('sequelize');
const db = require('../../models'); 
const { fnIsPublisherOfficeAdmin } = require('./generalHelpers');

//Procedure to Create a Post
async function spCreatePost(subAreaId, officeId, publisher_id, title, content, pLocation, filePath, type='N', rating=null) {
    const isOfficeAdmin = await fnIsPublisherOfficeAdmin(publisher_id);
    const validated = isOfficeAdmin ? true : false;
    let adminId = isOfficeAdmin ? publisher_id : null

    const transaction = await db.sequelize.transaction();
    try {
        const [result] = await db.sequelize.query(
            `INSERT INTO "dynamic_content"."posts" 
        ("sub_area_id", "office_id", "admin_id", "publisher_id", "creation_date", "type", "title", "content", "p_location", "filepath", "validated")
        VALUES (:subAreaId, :officeId, :adminId, :publisher_id, CURRENT_TIMESTAMP, :type, :title, :content, :pLocation, :filePath, :validated)
        RETURNING "post_id"`,
            {
                replacements: { subAreaId, officeId, adminId, publisher_id, type, title, content, pLocation, filePath, validated },
                type: QueryTypes.RAW,
                transaction
            }
        );
        if(type == 'P' )
        {
            const postId = result.post_id;
            await db.sequelize.query(
                `INSERT INTO "dynamic_content"."ratings" 
            ("post_id", "event_id", "critic_id", "evaluation")
            VALUES (:postId, NULL, :publisher_id, :rating)`,
                { replacements: { postId, publisher_id, rating }, type: QueryTypes.RAW, transaction }
            );
        }

        await transaction.commit();
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
}

// Function to Get Post State
async function fnGetPostState(postId) {
    const result = await db.sequelize.query(
        `SELECT CASE WHEN "validated" = true THEN 'Validated' ELSE 'Pending' END AS "state"
      FROM "dynamic_content"."posts"
      WHERE "post_id" = :postId`,
        { replacements: { postId }, type: QueryTypes.SELECT }
    );

    return result.length ? result[0].state : null;
}

//Procedure to Edit a Post
async function spEditPost(postId, subAreaId = null, officeId = null, adminId = null, title = null, content = null, pLocation = null, filePath = null, type = null) {
    const transaction = await db.sequelize.transaction();
    try {
        const post = await db.sequelize.query(
            `SELECT "validated" FROM "dynamic_content"."posts" WHERE "post_id" = :postId`,
            { replacements: { postId }, type: QueryTypes.SELECT, transaction }
        );

        if (post.length && post[0].validated === false) {
            await db.sequelize.query(
                `UPDATE "dynamic_content"."posts"
          SET
            "sub_area_id" = COALESCE(:subAreaId, "sub_area_id"),
            "office_id" = COALESCE(:officeId, "office_id"),
            "admin_id" = COALESCE(:adminId, "admin_id"),
            "title" = COALESCE(:title, "title"),
            "content" = COALESCE(:content, "content"),
            "p_location" = COALESCE(:pLocation, "p_location"),
            "filepath" = COALESCE(:filePath, "filepath"),
            "type" = COALESCE(:type, "type")
          WHERE "post_id" = :postId`,
                {
                    replacements: { postId, subAreaId, officeId, adminId, title, content, pLocation, filePath, type },
                    type: QueryTypes.UPDATE,
                    transaction
                }
            );
        } else {
            console.log('Post is already validated and cannot be edited.');
        }

        await transaction.commit();
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
}

module.exports = {
    spCreatePost,
    fnGetPostState,
    spEditPost
}