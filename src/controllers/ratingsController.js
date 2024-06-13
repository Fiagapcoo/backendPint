const RatingModel = require('../models/ratings');
const EventModel = require('../models/events');
const PostModel = require('../models/posts');
const UserModel = require('../models/users');

const RatingsController = {};

RatingsController.createRating = async (req, res) => {
    const { EVENT_ID, POST_ID, CRITIC_ID, EVALUATION } = req.body;
    try {
        const newRating = await RatingModel.create({
            EVENT_ID,
            POST_ID,
            CRITIC_ID,
            EVALUATION
        });
        res.status(201).json(newRating);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

RatingsController.getAllRatings = async (req, res) => {
    try {
        const ratings = await RatingModel.findAll({
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
                },
                {
                    model: UserModel,
                    attributes: ['USER_ID'],
                    required: false
                }
            ]
        });
        res.status(200).json(ratings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

RatingsController.getRatingById = async (req, res) => {
    const { id } = req.params;
    try {
        const rating = await RatingModel.findOne({
            where: {
                RATING_ID: id
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
                },
                {
                    model: UserModel,
                    attributes: ['USER_ID'],
                    required: false
                }
            ]
        });
        res.status(200).json(rating);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

RatingsController.updateRating = async (req, res) => {
    const { id } = req.params;
    const { EVENT_ID, POST_ID, CRITIC_ID, EVALUATION } = req.body;
    try {
        await RatingModel.update({
            EVENT_ID,
            POST_ID,
            CRITIC_ID,
            EVALUATION
        }, {
            where: {
                RATING_ID: id
            }
        });
        res.status(200).json({ message: 'Rating updated successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

RatingsController.deleteRating = async (req, res) => {
    const { id } = req.params;
    try {
        await RatingModel.destroy({
            where: {
                RATING_ID: id
            }
        });
        res.status(200).json({ message: 'Rating deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = RatingsController;
