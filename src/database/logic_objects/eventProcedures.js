const { QueryTypes } = require('sequelize');
const { fnIsPublisherOfficeAdmin } = require('./generalHelpers');
const db = require('../../models'); 

//Procedure to Create an Event
async function spCreateEvent(officeId, subAreaId, name, description, eventDate, recurring, recurring_pattern, max_participants, location, publisher_id) {
    const isOfficeAdmin = await fnIsPublisherOfficeAdmin(publisher_id);
    const validated = isOfficeAdmin ? true : false;
    let admin_id = isOfficeAdmin ? publisher_id : null;

    const transaction = await db.sequelize.transaction();
    try {
        const [eventResult] = await  db.sequelize.query(
            `INSERT INTO "dynamic_content"."events" 
        ("office_id", "subarea_id", "publihser_id", "admin_id", "creation_date", "name", "description", "event_date", "recurring", "recurring_pattern", "max_participants", "event_location", "validated")
        VALUES (:officeId, :subAreaId, :publisher_id, :admin_id, CURRENT_TIMESTAMP, :name, :description, :eventDate, :recurring, :recurring_pattern, :max_participants, :location, :validated)`,
            {
                replacements: { officeId, subAreaId, publisher_id, admin_id, name, description, eventDate, recurring, recurring_pattern, max_participants, location, validated },
                type: QueryTypes.RAW,
                transaction
            }
        );

        const eventId = eventResult[0].event_id;
        // Create the forum associated with the event
        const [forumResult] = await db.sequelize.query(
            `INSERT INTO "dynamic_content"."forums" 
            ("office_id", "sub_area_id", "title", "content", "creation_date", "publisher_id", "admin_id", "event_id", "validated")
            VALUES (:officeId, :subAreaId, :title, :description, CURRENT_TIMESTAMP, :publisher_id, :admin_id, :eventId, :validated)
            RETURNING "forum_id"`,
            {
                replacements: { officeId, subAreaId, title: name, description, publisher_id, admin_id, eventId, validated },
                type: QueryTypes.INSERT,
                transaction
            }
        );

        const forumId = forumResult[0].forum_id;
        // Grant access to the publisher for the created forum
        await db.sequelize.query(
            `INSERT INTO "control"."event_forum_access" ("user_id", "forum_id")
            VALUES (:publisher_id, :forumId)`,
            { replacements: { publisher_id, forumId }, type: QueryTypes.INSERT, transaction }
        );


        await transaction.commit();
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
}

//Procedure to Clean Up Event Participation
async function spEventParticipationCleanup() {
    const transaction = await db.sequelize.transaction();
    try {
        const inactiveUsers = await db.sequelize.query(
            `SELECT ep."user_id", ep."event_id"
        FROM "control"."participation" ep
        JOIN "hr"."users" u ON ep."user_id" = u."user_id"
        WHERE u."is_active" = 0`,
            { type: QueryTypes.SELECT, transaction }
        );

        for (const user of inactiveUsers) {
            await db.sequelize.query(
                `DELETE FROM "control"."participation"
          WHERE "user_id" = :userId AND "event_id" = :eventId`,
                { replacements: { userId: user.user_id, eventId: user.event_id }, type: QueryTypes.DELETE, transaction }
            );
        }

        await transaction.commit();
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
}

//Procedure to Unregister a User from an Event
async function spUnregisterUserFromEvent(userId, eventId) {
    const transaction = await db.sequelize.transaction();
    try {
        const forumIdResult = await db.sequelize.query(
            `SELECT "forum_id"
        FROM "dynamic_content"."forums"
        WHERE "event_id" = :eventId`,
            { replacements: { eventId }, type: QueryTypes.SELECT, transaction }
        );

        if (forumIdResult.length === 0) {
            throw new Error('Forum not found for the event.');
        }

        const forumId = forumIdResult[0].forum_id;

        await db.sequelize.query(
            `DELETE FROM "control"."participation"
        WHERE "user_id" = :userId AND "event_id" = :eventId`,
            { replacements: { userId, eventId }, type: QueryTypes.DELETE, transaction }
        );

        await db.sequelize.query(
            `DELETE FROM "control"."event_forum_access"
        WHERE "user_id" = :userId AND "forum_id" = :forumId`,
            { replacements: { userId, forumId }, type: QueryTypes.DELETE, transaction }
        );

        await db.sequelize.query(
            `UPDATE "dynamic_content"."events"
        SET "current_participants" = "current_participants" - 1
        WHERE "event_id" = :eventId`,
            { replacements: { eventId }, type: QueryTypes.UPDATE, transaction }
        );

        await transaction.commit();
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
}

async function spRegisterUserForEvent(userId, eventId) {
    const transaction = await db.sequelize.transaction();
    try {
        const forumIdResult = await db.sequelize.query(
            `SELECT "forum_id"
            FROM "dynamic_content"."forums"
            WHERE "event_id" = :eventId`,
            { replacements: { eventId }, type: QueryTypes.SELECT, transaction }
        );

        if (forumIdResult.length === 0) {
            throw new Error('Forum not found for the event.');
        }

        const forumId = forumIdResult[0].forum_id;

        const participationExists = await db.sequelize.query(
            `SELECT 1
            FROM "control"."participation"
            WHERE "user_id" = :userId AND "event_id" = :eventId`,
            { replacements: { userId, eventId }, type: QueryTypes.SELECT, transaction }
        );

        if (participationExists.length === 0) {
            await db.sequelize.query(
                `INSERT INTO "control"."participation" ("user_id", "event_id")
                VALUES (:userId, :eventId)`,
                { replacements: { userId, eventId }, type: QueryTypes.INSERT, transaction }
            );
        } else {
            console.log('User is already registered for this event.');
        }

        const forumAccessExists = await db.sequelize.query(
            `SELECT 1
            FROM "control"."event_forum_access"
            WHERE "user_id" = :userId AND "forum_id" = :forumId`,
            { replacements: { userId, forumId }, type: QueryTypes.SELECT, transaction }
        );

        if (forumAccessExists.length === 0) {
            await db.sequelize.query(
                `INSERT INTO "control"."event_forum_access" ("user_id", "forum_id")
                VALUES (:userId, :forumId)`,
                { replacements: { userId, forumId }, type: QueryTypes.INSERT, transaction }
            );
        } else {
            console.log('User already has forum access for this event.');
        }

        await transaction.commit();
    } catch (error) {
        if (transaction) await transaction.rollback();

        console.error('Error registering user for event:', error.message);

        throw error;
    }
}


//Function to Get Event State
async function fnGetEventState(eventId) {
    const result = await db.sequelize.query(
        `SELECT CASE WHEN "validated" = true THEN 'Validated' ELSE 'Pending' END AS "state"
      FROM "dynamic_content"."events"
      WHERE "event_id" = :eventId`,
        { replacements: { eventId }, type: QueryTypes.SELECT }
    );

    return result.length ? result[0].state : null;
}

//Procedure to Edit an Event
async function spEditEvent(eventId, subAreaId = null, officeId = null, adminId = null, name = null, description = null, eventDate = null, 
                            eventLocation = null, filePath = null, recurring = null, recurringPattern = null, maxParticipants = null, currentParticipants = null) {
    
    const transaction = await db.sequelize.transaction();
    try {
        const event = await db.sequelize.query(
            `SELECT "validated" FROM "dynamic_content"."events" WHERE "event_id" = :eventId`,
            { replacements: { eventId }, type: QueryTypes.SELECT, transaction }
        );

        if (event.length && event[0].validated === false) {
            await db.sequelize.query(
                `UPDATE "dynamic_content"."events"
          SET
            "subarea_id" = COALESCE(:subAreaId, "subarea_id"),
            "office_id" = COALESCE(:officeId, "office_id"),
            "admin_id" = COALESCE(:adminId, "admin_id"),
            "name" = COALESCE(:name, "name"),
            "description" = COALESCE(:description, "description"),
            "event_date" = COALESCE(:eventDate, "event_date"),
            "event_location" = COALESCE(:eventLocation, "event_location"),
            "filepath" = COALESCE(:filePath, "filepath"),
            "recurring" = COALESCE(:recurring, "recurring"),
            "recurring_pattern" = COALESCE(:recurringPattern, "recurring_pattern"),
            "max_participants" = COALESCE(:maxParticipants, "max_participants"),
            "current_participants" = COALESCE(:currentParticipants, "current_participants")
          WHERE "event_id" = :eventId`,
                {
                    replacements: { eventId, subAreaId, officeId, adminId, name, description, eventDate, eventLocation, filePath, recurring, recurringPattern, maxParticipants, currentParticipants },
                    type: QueryTypes.UPDATE,
                    transaction
                }
            );
        } else {
            console.log('Event is already validated and cannot be edited.');
        }

        await transaction.commit();
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
}

module.exports = {
    spCreateEvent,
    spEventParticipationCleanup,
    spUnregisterUserFromEvent,
    spRegisterUserForEvent,
    fnGetEventState,
    spEditEvent
}