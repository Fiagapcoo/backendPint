const ScoreModel = require('../models/scores');
const EventModel = require('../models/events');
const PostModel = require('../models/posts');

const ScoresController = {};

/**
 * @description Creates a new score record in the database.
 * 
 * This function uses Sequelize's `create` method to add a new score 
 * to the 'Scores' table. It takes the score data from the request body. 
 * If the operation is successful, a success message and the newly created 
 * score data are returned as a JSON response. In case of an error, 
 * an error message is returned with HTTP status 500.
 * 
 * @async
 * @function createScore
 * @route {POST} /scores/create
 * @param {Object} req - The HTTP request object.
 * @param {Object} req.body - The body of the request containing score data.
 * @param {number} [req.body.EVENT_ID] - The ID of the event.
 * @param {number} [req.body.POST_ID] - The ID of the post.
 * @param {number} req.body.SCORE - The score value.
 * @param {number} req.body.NUM_OF_EVALS - The number of evaluations.
 * @param {Object} res - The HTTP response object.
 * @returns {Promise<void>} A promise that resolves with no return value.
 */
ScoresController.createScore = async (req, res) => {
    const { EVENT_ID, POST_ID, SCORE, NUM_OF_EVALS } = req.body;
    try {
        const newScore = await ScoreModel.create({
            EVENT_ID,
            POST_ID,
            SCORE,
            NUM_OF_EVALS
        });
        res.status(201).json(newScore);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

/**
 * @description Retrieves all scores from the database.
 * 
 * This function uses Sequelize's `findAll` method to fetch all scores 
 * from the 'Scores' table, including associated event and post information. 
 * The result is returned as a JSON response. In case of an error, an error message 
 * is returned with HTTP status 500.
 * 
 * @async
 * @function getAllScores
 * @route {GET} /scores
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 * @returns {Promise<void>} A promise that resolves with no return value.
 */
ScoresController.getAllScores = async (req, res) => {
    try {
        const scores = await ScoreModel.findAll({
            include: [
                {
                    model: EventModel,
                    attributes: ['EVENT_ID'],
                    required: false
                },
                {
                    model: PostModel,
                    attributes: ['POST_ID'],
                    required: false
                }
            ]
        });
        res.status(200).json(scores);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

/**
 * @description Retrieves a specific score by its ID from the database.
 * 
 * This function uses Sequelize's `findOne` method to fetch a specific score 
 * from the 'Scores' table by its ID, including associated event and post information. 
 * The result is returned as a JSON response. In case of an error, an error message 
 * is returned with HTTP status 500.
 * 
 * @async
 * @function getScoreById
 * @route {GET} /scores/:id
 * @param {Object} req - The HTTP request object.
 * @param {Object} req.params - The URL parameters.
 * @param {number} req.params.id - The ID of the score.
 * @param {Object} res - The HTTP response object.
 * @returns {Promise<void>} A promise that resolves with no return value.
 */
ScoresController.getScoreById = async (req, res) => {
    const { id } = req.params;
    try {
        const score = await ScoreModel.findOne({
            where: {
                AVG_RATING_ID: id
            },
            include: [
                {
                    model: EventModel,
                    attributes: ['EVENT_ID'],
                    required: false
                },
                {
                    model: PostModel,
                    attributes: ['POST_ID'],
                    required: false
                }
            ]
        });
        res.status(200).json(score);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

/**
 * @description Updates an existing score record in the database.
 * 
 * This function uses Sequelize's `update` method to modify an existing score 
 * in the 'Scores' table. It takes the score data from the request body 
 * and the ID of the score from the URL parameters. If the operation is successful, 
 * a success message is returned as a JSON response. In case of an error, 
 * an error message is returned with HTTP status 500.
 * 
 * @async
 * @function updateScore
 * @route {PUT} /scores/update/:id
 * @param {Object} req - The HTTP request object.
 * @param {Object} req.params - The URL parameters.
 * @param {number} req.params.id - The ID of the score.
 * @param {Object} req.body - The body of the request containing score data.
 * @param {number} [req.body.EVENT_ID] - The ID of the event.
 * @param {number} [req.body.POST_ID] - The ID of the post.
 * @param {number} req.body.SCORE - The score value.
 * @param {number} req.body.NUM_OF_EVALS - The number of evaluations.
 * @param {Object} res - The HTTP response object.
 * @returns {Promise<void>} A promise that resolves with no return value.
 */
ScoresController.updateScore = async (req, res) => {
    const { id } = req.params;
    const { EVENT_ID, POST_ID, SCORE, NUM_OF_EVALS } = req.body;
    try {
        await ScoreModel.update({
            EVENT_ID,
            POST_ID,
            SCORE,
            NUM_OF_EVALS
        }, {
            where: {
                AVG_RATING_ID: id
            }
        });
        res.status(200).json({ message: 'Score updated successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

/**
 * @description Deletes a score record from the database by its ID.
 * 
 * This function uses Sequelize's `destroy` method to remove a score 
 * from the 'Scores' table by its ID. If the operation is successful, 
 * a success message is returned as a JSON response. In case of an error, 
 * an error message is returned with HTTP status 500.
 * 
 * @async
 * @function deleteScore
 * @route {DELETE} /scores/delete/:id
 * @param {Object} req - The HTTP request object.
 * @param {Object} req.params - The URL parameters.
 * @param {number} req.params.id - The ID of the score.
 * @param {Object} res - The HTTP response object.
 * @returns {Promise<void>} A promise that resolves with no return value.
 */
ScoresController.deleteScore = async (req, res) => {
    const { id } = req.params;
    try {
        await ScoreModel.destroy({
            where: {
                AVG_RATING_ID: id
            }
        });
        res.status(200).json({ message: 'Score deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = ScoresController;
