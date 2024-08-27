const db = require('../../../models'); 

const createTriggerFunction_trg_increment_like_comment = async () => {
    await db.sequelize.query(`
        CREATE OR REPLACE FUNCTION communication.increment_likes()
        RETURNS TRIGGER AS $$
        BEGIN
            -- Update the likes in the comments table
            UPDATE "communication"."comments"
            SET likes = likes + 1
            WHERE comment_id = NEW.comment_id;
            
            RETURN NEW;
        END;
        $$ LANGUAGE plpgsql;
        `);
};

const createTrigger_increment_likes = async () => {
     await db.sequelize.query(` 
        CREATE TRIGGER trg_increment_likes
        AFTER INSERT ON "communication"."likes"
        FOR EACH ROW
        EXECUTE FUNCTION communication.increment_likes();
        `);
}

const createTriggerFunction_trg_decrement_like_comment = async () => {
    await db.sequelize.query(`
        CREATE OR REPLACE FUNCTION communication.decrement_likes()
        RETURNS TRIGGER AS $$
        BEGIN
            -- Update the likes in the comments table
            UPDATE "communication"."comments"
            SET likes = likes - 1
            WHERE comment_id = OLD.comment_id;
            
            RETURN OLD;
        END;
        $$ LANGUAGE plpgsql;
        `);
};

const createTrigger_decrement_likes = async () => {
    await db.sequelize.query(` 
       CREATE TRIGGER trg_decrement_likes
        AFTER DELETE ON "communication"."likes"
        FOR EACH ROW
        EXECUTE FUNCTION communication.decrement_likes();
       `);
}


module.exports = {
    createTriggerFunction_trg_increment_like_comment,
    createTrigger_increment_likes,
    createTriggerFunction_trg_decrement_like_comment,
    createTrigger_decrement_likes
};