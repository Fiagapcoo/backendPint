const db = require('../../../models'); 

const createTriggerFunction_trg_increment_like_comment = async () => {
    await db.sequelize.query(`
        CREATE OR REPLACE FUNCTION communication.increment_like_count()
        RETURNS TRIGGER AS $$
        BEGIN
            -- Update the like_count in the comments table
            UPDATE "communication"."comments"
            SET like_count = like_count + 1
            WHERE comment_id = NEW.comment_id;
            
            RETURN NEW;
        END;
        $$ LANGUAGE plpgsql;
        `);
};

const createTrigger_increment_like_count = async () => {
     await db.sequelize.query(` 
        CREATE TRIGGER trg_increment_like_count
        AFTER INSERT ON "communication"."likes"
        FOR EACH ROW
        EXECUTE FUNCTION communication.increment_like_count();
        `);
}

const createTriggerFunction_trg_decrement_like_comment = async () => {
    await db.sequelize.query(`
        CREATE OR REPLACE FUNCTION communication.decrement_like_count()
        RETURNS TRIGGER AS $$
        BEGIN
            -- Update the like_count in the comments table
            UPDATE "communication"."comments"
            SET like_count = like_count - 1
            WHERE comment_id = OLD.comment_id;
            
            RETURN OLD;
        END;
        $$ LANGUAGE plpgsql;
        `);
};

const createTrigger_decrement_like_count = async () => {
    await db.sequelize.query(` 
       CREATE TRIGGER trg_decrement_like_count
        AFTER DELETE ON "communication"."likes"
        FOR EACH ROW
        EXECUTE FUNCTION communication.decrement_like_count();
       `);
}


module.exports = {
    createTriggerFunction_trg_increment_like_comment,
    createTrigger_increment_like_count,
    createTriggerFunction_trg_decrement_like_comment,
    createTrigger_decrement_like_count
};