const RatingModel = require('../models/ratings');
const EventModel = require('../models/events');
const PostModel = require('../models/posts');
const UserModel = require('../models/users');

const RatingsController = {};

/**
 * @description Creates a new rating record in the database.
 * 
 * This function uses Sequelize's `create` method to add a new rating 
 * to the 'Ratings' table. It takes the rating data from the request body. 
 * If the operation is successful, a success message and the newly created 
 * rating data are returned as a JSON response. In case of an error, 
 * an error message is returned with HTTP status 500.
 * 
 * @async
 * @function createRating
 * @route {POST} /ratings/create
 * @param {Object} req - The HTTP request object.
 * @param {Object} req.body - The body of the request containing rating data.
 * @param {number} req.body.EVENT_ID - The ID of the event.
 * @param {number} req.body.POST_ID - The ID of the post.
 * @param {number} req.body.CRITIC_ID - The ID of the critic.
 * @param {number} req.body.EVALUATION - The evaluation rating.
 * @param {Object} res - The HTTP response object.
 * @returns {Promise<void>} A promise that resolves with no return value.
 */
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

/**
 * @description Retrieves all ratings from the database.
 * 
 * This function uses Sequelize's `findAll` method to fetch all ratings 
 * from the 'Ratings' table, including associated event, post, and user information. 
 * The result is returned as a JSON response. In case of an error, an error message 
 * is returned with HTTP status 500.
 * 
 * @async
 * @function getAllRatings
 * @route {GET} /ratings
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 * @returns {Promise<void>} A promise that resolves with no return value.
 */
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

/**
 * @description Retrieves a specific rating by its ID from the database.
 * 
 * This function uses Sequelize's `findOne` method to fetch a specific rating 
 * from the 'Ratings' table by its ID, including associated event, post, and user information. 
 * The result is returned as a JSON response. In case of an error, an error message 
 * is returned with HTTP status 500.
 * 
 * @async
 * @function getRatingById
 * @route {GET} /ratings/:id
 * @param {Object} req - The HTTP request object.
 * @param {Object} req.params - The URL parameters.
 * @param {number} req.params.id - The ID of the rating.
 * @param {Object} res - The HTTP response object.
 * @returns {Promise<void>} A promise that resolves with no return value.
 */
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

/**
 * @description Updates an existing rating record in the database.
 * 
 * This function uses Sequelize's `update` method to modify an existing rating 
 * in the 'Ratings' table. It takes the rating data from the request body 
 * and the ID of the rating from the URL parameters. If the operation is successful, 
 * a success message is returned as a JSON response. In case of an error, 
 * an error message is returned with HTTP status 500.
 * 
 * @async
 * @function updateRating
 * @route {PUT} /ratings/update/:id
 * @param {Object} req - The HTTP request object.
 * @param {Object} req.params - The URL parameters.
 * @param {number} req.params.id - The ID of the rating.
 * @param {Object} req.body - The body of the request containing rating data.
 * @param {number} req.body.EVENT_ID - The ID of the event.
 * @param {number} req.body.POST_ID - The ID of the post.
 * @param {number} req.body.CRITIC_ID - The ID of the critic.
 * @param {number} req.body.EVALUATION - The evaluation rating.
 * @param {Object} res - The HTTP response object.
 * @returns {Promise<void>} A promise that resolves with no return value.
 */
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

/**
 * @description Deletes a rating record from the database by its ID.
 * 
 * This function uses Sequelize's `destroy` method to remove a rating 
 * from the 'Ratings' table by its ID. If the operation is successful, 
 * a success message is returned as a JSON response. In case of an error, 
 * an error message is returned with HTTP status 500.
 * 
 * @async
 * @function deleteRating
 * @route {DELETE} /ratings/delete/:id
 * @param {Object} req - The HTTP request object.
 * @param {Object} req.params - The URL parameters.
 * @param {number} req.params.id - The ID of the rating.
 * @param {Object} res - The HTTP response object.
 * @returns {Promise<void>} A promise that resolves with no return value.
 */
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
