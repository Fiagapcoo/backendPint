const AnswerModel = require('../models/answers');
const UserModel = require('../models/users');
const FieldModel = require('../models/fields');

const AnswersController = {};

/**
 * @description Creates a new answer record in the database.
 * 
 * This function uses Sequelize's `create` method to add a new answer 
 * to the 'Answers' table. It takes the answer data from the request body. 
 * If the operation is successful, a success message and the newly created 
 * answer data are returned as a JSON response. In case of an error, 
 * an error message is returned with HTTP status 500.
 * 
 * @async
 * @function createAnswer
 * @route {POST} /answers/create
 * @param {Object} req - The HTTP request object.
 * @param {Object} req.body - The body of the request containing answer data.
 * @param {number} req.body.USER_ID - The ID of the user.
 * @param {number} req.body.EVENT_ID - The ID of the event.
 * @param {number} req.body.FIELD_ID - The ID of the field.
 * @param {string} req.body.ANSWER - The answer content.
 * @param {Object} res - The HTTP response object.
 * @returns {Promise<void>} A promise that resolves with no return value.
 */
AnswersController.createAnswer = async (req, res) => {
    const { USER_ID, EVENT_ID, FIELD_ID, ANSWER } = req.body;
    try {
        const newAnswer = await AnswerModel.create({
            USER_ID,
            EVENT_ID,
            FIELD_ID,
            ANSWER
        });
        res.status(201).json(newAnswer);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

/**
 * @description Retrieves all answers from the database.
 * 
 * This function uses Sequelize's `findAll` method to fetch all answers 
 * from the 'Answers' table. The result is returned as a JSON response. 
 * In case of an error, an error message is returned with HTTP status 500.
 * 
 * @async
 * @function getAllAnswers
 * @route {GET} /answers/list
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 * @returns {Promise<void>} A promise that resolves with no return value.
 */
AnswersController.getAllAnswers = async (req, res) => {
    try {
        const answers = await AnswerModel.findAll({
            include: [
                {
                    model: UserModel,
                    attributes: ['USER_ID']
                },
                {
                    model: FieldModel,
                    attributes: ['EVENT_ID', 'FIELD_ID']
                }
            ]
        });
        res.status(200).json(answers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

/**
 * @description Retrieves an answer by ID from the database.
 * 
 * This function uses Sequelize's `findOne` method to fetch a specific answer 
 * from the 'Answers' table by its ID. The result is returned as a JSON response. 
 * In case of an error, an error message is returned with HTTP status 500.
 * 
 * @async
 * @function getAnswerById
 * @route {GET} /answers/get/:id
 * @param {Object} req - The HTTP request object.
 * @param {Object} req.params - The URL parameters.
 * @param {number} req.params.id - The ID of the answer.
 * @param {Object} res - The HTTP response object.
 * @returns {Promise<void>} A promise that resolves with no return value.
 */
AnswersController.getAnswerById = async (req, res) => {
    const { id } = req.params;
    try {
        const answer = await AnswerModel.findOne({
            where: {
                ID: id
            },
            include: [
                {
                    model: UserModel,
                    attributes: ['USER_ID']
                },
                {
                    model: FieldModel,
                    attributes: ['EVENT_ID', 'FIELD_ID']
                }
            ]
        });
        res.status(200).json(answer);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

/**
 * @description Updates an existing answer record in the database.
 * 
 * This function uses Sequelize's `update` method to modify an existing answer 
 * in the 'Answers' table. It takes the answer data from the request body 
 * and the ID of the answer from the URL parameters. If the operation is successful, 
 * a success message is returned as a JSON response. In case of an error, 
 * an error message is returned with HTTP status 500.
 * 
 * @async
 * @function updateAnswer
 * @route {PUT} /answers/update/:id
 * @param {Object} req - The HTTP request object.
 * @param {Object} req.params - The URL parameters.
 * @param {number} req.params.id - The ID of the answer.
 * @param {Object} req.body - The body of the request containing answer data.
 * @param {number} req.body.USER_ID - The ID of the user.
 * @param {number} req.body.EVENT_ID - The ID of the event.
 * @param {number} req.body.FIELD_ID - The ID of the field.
 * @param {string} req.body.ANSWER - The answer content.
 * @param {Object} res - The HTTP response object.
 * @returns {Promise<void>} A promise that resolves with no return value.
 */
AnswersController.updateAnswer = async (req, res) => {
    const { id } = req.params;
    const { USER_ID, EVENT_ID, FIELD_ID, ANSWER } = req.body;
    try {
        await AnswerModel.update({
            USER_ID,
            EVENT_ID,
            FIELD_ID,
            ANSWER
        }, {
            where: {
                ID: id
            }
        });
        res.status(200).json({ message: 'Answer updated successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

/**
 * @description Deletes an answer record from the database.
 * 
 * This function uses Sequelize's `destroy` method to remove an answer 
 * from the 'Answers' table by its ID. If the operation is successful, 
 * a success message is returned as a JSON response. In case of an error, 
 * an error message is returned with HTTP status 500.
 * 
 * @async
 * @function deleteAnswer
 * @route {DELETE} /answers/delete/:id
 * @param {Object} req - The HTTP request object.
 * @param {Object} req.params - The URL parameters.
 * @param {number} req.params.id - The ID of the answer.
 * @param {Object} res - The HTTP response object.
 * @returns {Promise<void>} A promise that resolves with no return value.
 */
AnswersController.deleteAnswer = async (req, res) => {
    const { id } = req.params;
    try {
        await AnswerModel.destroy({
            where: {
                ID: id
            }
        });
        res.status(200).json({ message: 'Answer deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = AnswersController;
