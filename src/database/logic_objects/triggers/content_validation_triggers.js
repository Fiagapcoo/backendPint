const db = require("../../../models");

const createTriggerFunction_trg_content_validation = async () => {
  await db.sequelize.query(`
        CREATE OR REPLACE FUNCTION admin.trg_content_status_approved()
        RETURNS TRIGGER AS $$
        DECLARE
            content_real_id INT;
            content_type TEXT;
            content_status TEXT;
            publisher_id INT;
            error_message TEXT;
            error_severity TEXT;
            error_state TEXT;
        BEGIN
            -- Check if CONTENT_STATUS is updated to 'Approved'
            IF EXISTS (
                SELECT 1
                FROM inserted i
                JOIN deleted d ON i.content_real_id = d.content_real_id
                WHERE i.content_status = 'Approved'
                AND d.content_status <> 'Approved'
                AND i.content_type = 'Event'
            ) THEN
                BEGIN
                    BEGIN
                        SELECT i.content_real_id, i.content_type, i.content_status
                        INTO content_real_id, content_type, content_status
                        FROM inserted i
                        WHERE i.content_status = 'Approved'
                        AND i.content_type = 'Event';

                        -- Get the Publisher ID from the EVENTS table
                        SELECT publisher_id
                        INTO publisher_id
                        FROM dynamic_content.events
                        WHERE event_id = content_real_id;

                        -- Insert into PARTICIPATION and SCORES tables if the event is approved
                        INSERT INTO control.participation (user_id, event_id)
                        VALUES (publisher_id, content_real_id);

                        INSERT INTO dynamic_content.scores (event_id, score)
                        VALUES (content_real_id, 0);

                    EXCEPTION
                        WHEN OTHERS THEN
                            GET STACKED DIAGNOSTICS error_message = MESSAGE_TEXT,
                                                    error_severity = RETURNED_SQLSTATE,
                                                    error_state = PG_EXCEPTION_DETAIL;
                            -- Log the error details (Assuming a log_error function exists)
                            PERFORM security.log_error(error_message, error_severity, error_state);
                            RAISE NOTICE 'Error: %', error_message;
                            RETURN NULL;
                    END;
                END;
            END IF;
            RETURN NEW;
        END;
        $$ LANGUAGE plpgsql;
         `);
};

const createTrigger_validateContent = async () => {
  await db.sequelize.query(`
            DO $$ 
            BEGIN
            IF EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trg_content_status_approved') THEN
                DROP TRIGGER trg_content_status_approved ON admin.content_validation_status;
            END IF;
            CREATE TRIGGER trg_content_status_approved
            AFTER UPDATE ON admin.content_validation_status
            FOR EACH ROW
            EXECUTE FUNCTION admin.trg_content_status_approved();
            END $$;`);
};

const createTriggerFunction_trg_update_content_admin_id = async () => {
  await db.sequelize.query(`
    CREATE OR REPLACE FUNCTION admin.trg_update_content_admin_id()
RETURNS TRIGGER AS $$
DECLARE
    content_id INT;
    content_type TEXT;
    admin_id INT;
BEGIN
    -- Get values from NEW row
    content_id := NEW.content_real_id;
    content_type := NEW.content_type;
    admin_id := NEW.validator_id;

    -- Depending on the content type, update the respective table
    IF content_type = 'Post' THEN
        UPDATE dynamic_content.posts
        SET admin_id = admin_id
        WHERE post_id = content_id;
    ELSIF content_type = 'Event' THEN
        UPDATE dynamic_content.events
        SET admin_id = admin_id
        WHERE event_id = content_id;
    ELSIF content_type = 'Forum' THEN
        UPDATE dynamic_content.forums
        SET admin_id = admin_id
        WHERE forum_id = content_id;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
 `);
};

const createTrigger_contentValidated = async () => {
  await db.sequelize.query(`
            DO $$ 
            BEGIN
            IF EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trg_update_content_admin_id') THEN
                DROP TRIGGER trg_update_content_admin_id ON admin.content_validation_status;
            END IF;
            CREATE TRIGGER trg_update_content_admin_id
            AFTER UPDATE ON admin.content_validation_status
            FOR EACH ROW
            EXECUTE FUNCTION admin.trg_update_content_admin_id();
            END $$;
`);
};

module.exports = {
  createTriggerFunction_trg_content_validation,
  createTrigger_validateContent,
  createTriggerFunction_trg_update_content_admin_id,
  createTrigger_contentValidated,
};
