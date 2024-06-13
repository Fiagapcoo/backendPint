const AnswerModel = require('../models/answers');
const UserModel = require('../models/users');
const FieldModel = require('../models/fields');

const AnswersController = {};

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
                    attributes: ['EVENT_ID', 'FIELD_ID',]
                }
            ]
        });
        res.status(200).json(answer);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

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
