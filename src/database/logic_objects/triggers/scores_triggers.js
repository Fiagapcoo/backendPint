
const db = require('../../../models'); 


const createFunction_reverseRating = async () => {
    await db.sequelize.query(`
      CREATE OR REPLACE FUNCTION dynamic_content.fn_reverse_rating(
        avg_rating DECIMAL(3, 1),
        num_of_ratings INT,
        new_rating INT
      )
      RETURNS DECIMAL(10, 1) AS $$
      DECLARE
        total_of_ratings DECIMAL(10, 1);
        new_avg_rating DECIMAL(10, 1);
      BEGIN
        total_of_ratings := avg_rating * num_of_ratings;
        total_of_ratings := total_of_ratings + CAST(new_rating AS DECIMAL(2, 1));
        num_of_ratings := num_of_ratings + 1;
        new_avg_rating := total_of_ratings / num_of_ratings;
        RETURN new_avg_rating;
      END;
      $$ LANGUAGE plpgsql;
    `);
  };
  
  const createTriggerFunction_updateAVG_Score = async () => {
    await db.sequelize.query(`
        CREATE OR REPLACE FUNCTION dynamic_content.trg_update_average_score()
        RETURNS TRIGGER AS $$
        DECLARE
            record RECORD;
            event_id INT;
            post_id INT;
            rating INT;
            avg_score DECIMAL(3, 1);
            new_avg_rating DECIMAL(3, 1);
            num_of_evals INT;
            error_message TEXT;
            error_severity TEXT;
            error_state TEXT;
        BEGIN
            -- Iterate over inserted rows
            FOR record IN 
                SELECT event_id, post_id, evaluation
                FROM dynamic_content.evaluations
                WHERE event_id = NEW.event_id OR post_id = NEW.post_id
            LOOP
                event_id := record.event_id;
                post_id := record.post_id;
                rating := record.evaluation;

                BEGIN
                    IF post_id IS NOT NULL THEN
                        SELECT score, num_of_evals INTO avg_score, num_of_evals
                        FROM dynamic_content.scores
                        WHERE post_id = post_id;

                        new_avg_rating := dynamic_content.fn_reverse_rating(avg_score, num_of_evals, rating);

                        UPDATE dynamic_content.scores
                        SET score = new_avg_rating,
                            num_of_evals = num_of_evals + 1
                        WHERE post_id = post_id;

                    ELSIF event_id IS NOT NULL THEN
                        SELECT score, num_of_evals INTO avg_score, num_of_evals
                        FROM dynamic_content.scores
                        WHERE event_id = event_id;

                        new_avg_rating := dynamic_content.fn_reverse_rating(avg_score, num_of_evals, rating);

                        UPDATE dynamic_content.scores
                        SET score = new_avg_rating,
                            num_of_evals = num_of_evals + 1
                        WHERE event_id = event_id;
                    END IF;

                EXCEPTION
                    WHEN OTHERS THEN
                        GET STACKED DIAGNOSTICS error_message = MESSAGE_TEXT,
                                                error_severity = RETURNED_SQLSTATE,
                                                error_state = PG_EXCEPTION_DETAIL;
                        RAISE NOTICE 'Error: %', error_message;
                        RETURN NULL;
                END;
            END LOOP;

            RETURN NEW;
        END;
        $$ LANGUAGE plpgsql;
    `);
};

  

  const createTrigger_score = async () => {
    await db.sequelize.query(`
        DO $$ 
        BEGIN
          IF EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trg_update_average_score') THEN
            DROP TRIGGER trg_update_average_score ON dynamic_content.ratings;
          END IF;
          CREATE TRIGGER trg_update_average_score
          AFTER INSERT ON dynamic_content.ratings
          FOR EACH ROW
          EXECUTE FUNCTION dynamic_content.trg_update_average_score();
        END $$;
      `);
  };

  module.exports = {
    createFunction_reverseRating,
    createTriggerFunction_updateAVG_Score,
    createTrigger_score
  }