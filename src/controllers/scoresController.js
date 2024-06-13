const ScoreModel = require('../models/scores');
const EventModel = require('../models/events');
const PostModel = require('../models/posts');

const ScoresController = {};

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
