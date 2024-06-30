const db = require('../../models'); 
const { QueryTypes } = require('sequelize');
//const { parse } = require('json2sql'); /


//to add more forms to a pendent event that is already created
async function addCustomFieldsToEventForm(eventID, customFieldsJson) {
  const t = await db.sequelize.transaction();
  try {
    // Check if the event is validated
    const event = await db.sequelize.query(
      `SELECT 1 FROM "dynamic_content"."events" WHERE "event_id" = :eventID AND "validated" = false`,
      {
        replacements: { eventID },
        type: QueryTypes.SELECT,
        transaction: t
      }
    );

    if (event.length === 0) {
      console.log('Event is already validated and cannot be edited.');
      await t.rollback();
      return;
    }

    // Convert JSON to array and insert custom fields
    const customFields = JSON.parse(customFieldsJson);

    for (const field of customFields) {
      await db.sequelize.query(
        `INSERT INTO "forms"."fields" ("event_id", "field_name", "field_type", "field_value", "max_value", "min_value")
         VALUES (:eventID, :fieldName, :fieldType, :fieldValue, :maxValue, :minValue)`,
        {
          replacements: {
            eventID,
            fieldName: field.field_name,
            fieldType: field.field_type,
            fieldValue: field.field_value,
            maxValue: field.max_value,
            minValue: field.min_value
          },
          type: QueryTypes.INSERT,
          transaction: t
        }
      );
    }

    await t.commit();
  } catch (error) {
    await t.rollback();
    console.error('Error adding custom fields:', error);
    await db.sequelize.query(
      `EXEC "security"."log_error" :errorMessage`,
      {
        replacements: { errorMessage: error.message },
        type: QueryTypes.RAW
      }
    );
    throw error;
  }
}

async function createEventForm(eventID, customFieldsJson) {
    const t = await db.sequelize.transaction();
    try {
      // Copy default fields to the new event form
      await db.sequelize.query(
        `INSERT INTO "forms"."fields" ("event_id", "field_name", "field_type", "field_value", "max_value", "min_value", "def_field_id")
         SELECT :eventID, "field_name", "field_type", "field_value", "max_value", "min_value", "field_id"
         FROM "forms"."default_fields"`,
        {
          replacements: { eventID },
          type: QueryTypes.INSERT,
          transaction: t
        }
      );
  
      // Convert JSON to array and insert custom fields
      const customFields = JSON.parse(customFieldsJson);
  
      for (const field of customFields) {
        await db.sequelize.query(
          `INSERT INTO "forms"."fields" ("event_id", "field_name", "field_type", "field_value", "max_value", "min_value")
           VALUES (:eventID, :fieldName, :fieldType, :fieldValue, :maxValue, :minValue)`,
          {
            replacements: {
              eventID,
              fieldName: field.field_name,
              fieldType: field.field_type,
              fieldValue: field.field_value,
              maxValue: field.max_value,
              minValue: field.min_value
            },
            type: QueryTypes.INSERT,
            transaction: t
          }
        );
      }
  
      await t.commit();
    } catch (error) {
      await t.rollback();
      console.error('Error creating event form:', error);
      await db.sequelize.query(
        `EXEC "security"."log_error" :errorMessage`,
        {
          replacements: { errorMessage: error.message },
          type: QueryTypes.RAW
        }
      );
      throw error;
    }
}


async function editEventFormField(eventID, fieldID, { fieldName = null, fieldType = null, fieldValue = null, maxValue = null, minValue = null }) {
        const t = await db.sequelize.transaction();
        try {
          // Check if the event is validated
          const event = await db.sequelize.query(
            `SELECT 1 FROM "dynamic_content"."events" WHERE "event_id" = :eventID AND "validated" = false`,
            {
              replacements: { eventID },
              type: QueryTypes.SELECT,
              transaction: t
            }
          );
      
          if (event.length === 0) {
            console.log('Event is already validated and cannot be edited.');
            await t.rollback();
            return;
          }
      
          // Update the specified field for the event
          await db.sequelize.query(
            `UPDATE "forms"."fields"
             SET
                 "field_name" = COALESCE(:fieldName, "field_name"),
                 "field_type" = COALESCE(:fieldType, "field_type"),
                 "field_value" = COALESCE(:fieldValue, "field_value"),
                 "max_value" = COALESCE(:maxValue, "max_value"),
                 "min_value" = COALESCE(:minValue, "min_value")
             WHERE "event_id" = :eventID AND "field_id" = :fieldID`,
            {
              replacements: { eventID, fieldID, fieldName, fieldType, fieldValue, maxValue, minValue },
              type: QueryTypes.UPDATE,
              transaction: t
            }
          );
      
          await t.commit();
        } catch (error) {
          await t.rollback();
          console.error('Error editing event form field:', error);
          await db.sequelize.query(
            `EXEC "security"."log_error" :errorMessage`,
            {
              replacements: { errorMessage: error.message },
              type: QueryTypes.RAW
            }
          );
          throw error;
        }
}
  
async function getFormSchema(eventID) {
    try {
      const formschema = await db.sequelize.query(
        `SELECT "event_id", "field_id", "def_field_id", "field_name", "field_type", "field_value", "max_value", "min_value"
         FROM "forms"."fields"
         WHERE "event_id" = :eventID
         ORDER BY "field_id"`,
        {
          replacements: { eventID },
          type: QueryTypes.SELECT
        }
      );
      return formschema;
    } catch (error) {
      console.error('Error fetching form schema:', error);
      throw error;
    }  
}
  
async function getFormSchemaAsJson(eventID) {
    try {
      const formschema = await db.sequelize.query(
        `SELECT "event_id", "field_id", "def_field_id", "field_name", "field_type", "field_value", "max_value", "min_value"
         FROM "forms"."fields"
         WHERE "event_id" = :eventID
         ORDER BY "field_id"
         FOR JSON AUTO, ROOT('formschema')`,
        {
          replacements: { eventID },
          type: QueryTypes.RAW
        }
      );
      return formschema[0][''];
    } catch (error) {
      console.error('Error fetching form schema as JSON:', error);
      throw error;
    }
}

async function insertFormAnswer(userID, eventID, fieldID, answer) {
    const t = await db.sequelize.transaction();
    try {
      await db.sequelize.query(
        `INSERT INTO "forms"."answers" ("user_id", "event_id", "field_id", "answer", "entry_date")
         VALUES (:userID, :eventID, :fieldID, :answer, CURRENT_TIMESTAMP)`,
        {
          replacements: { userID, eventID, fieldID, answer },
          type: QueryTypes.INSERT,
          transaction: t
        }
      );
  
      await t.commit();
    } catch (error) {
      await t.rollback();
      console.error('Error inserting form answer:', error);
      await db.sequelize.query(
        `EXEC "security"."log_error" :errorMessage`,
        {
          replacements: { errorMessage: error.message },
          type: QueryTypes.RAW
        }
      );
      throw error;
    }
}

async function insertFormAnswers(userID, eventID, answersJson) {
    const t = await db.sequelize.transaction();
    try {
      // Convert JSON to array and insert answers
      const answers = JSON.parse(answersJson);
  
      for (const answer of answers) {
        await db.sequelize.query(
          `INSERT INTO "forms"."answers" ("user_id", "event_id", "field_id", "answer", "entry_date")
           VALUES (:userID, :eventID, :fieldID, :answer, CURRENT_TIMESTAMP)`,
          {
            replacements: {
              userID,
              eventID,
              fieldID: answer.field_id,
              answer: answer.ANSWER
            },
            type: QueryTypes.INSERT,
            transaction: t
          }
        );
      }
  
      await t.commit();
    } catch (error) {
      await t.rollback();
      console.error('Error inserting multiple form answers:', error);
      await db.sequelize.query(
        `EXEC "security"."log_error" :errorMessage`,
        {
          replacements: { errorMessage: error.message },
          type: QueryTypes.RAW
        }
      );
      throw error;
    }
}


async function deleteEventFormField(eventID, fieldID) {
  const t = await db.sequelize.transaction();
  try {
      // Check if the event is validated
      const event = await db.sequelize.query(
          `SELECT 1 FROM "dynamic_content"."events" WHERE "event_id" = :eventID AND "validated" = false`,
          {
              replacements: { eventID },
              type: QueryTypes.SELECT,
              transaction: t
          }
      );

      if (event.length === 0) {
          console.log('Event is already validated and cannot be edited.');
          await t.rollback();
          return;
      }

      // Delete the specified field for the event
      await db.sequelize.query(
          `DELETE FROM "forms"."fields" WHERE "event_id" = :eventID AND "field_id" = :fieldID`,
          {
              replacements: { eventID, fieldID },
              type: QueryTypes.DELETE,
              transaction: t
          }
      );

      await t.commit();
      console.log('Field deleted successfully.');
  } catch (error) {
      await t.rollback();
      console.error('Error deleting event form field:', error);
      await db.sequelize.query(
          `EXEC "security"."log_error" :errorMessage`,
          {
              replacements: { errorMessage: error.message },
              type: QueryTypes.RAW
          }
      );
      throw error;
  }
}

module.exports = {
  addCustomFieldsToEventForm,
  createEventForm,
  editEventFormField,
  getFormSchema,
  getFormSchemaAsJson,
  insertFormAnswer,
  insertFormAnswers,
  deleteEventFormField
};
