const postsModel = require('../models/posts');
const subAreaModel = require('../models/sub_area');
const userModel = require('../models/users');
const officeModel = require('../models/office_admins');
const postsController = {};

/**
 * @description Retrieves all posts from the database.
 * 
 * This function uses Sequelize's `findAll` method to fetch all posts 
 * from the 'Posts' table, including associated sub-area, admin, publisher, and office information. 
 * The result is returned as a JSON response. In case of an error, an error message 
 * is returned with HTTP status 500.
 * 
 * @async
 * @function getPosts
 * @route {GET} /posts
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 * @returns {Promise<void>} A promise that resolves with no return value.
 */
postsController.getPosts = async (req, res) => {
    try {
        const posts = await postsModel.findAll({
            include: [
                {
                    model: subAreaModel,
                    attributes: ['SUB_AREA_ID']
                },
                {
                    model: userModel,
                    as: 'Admin',
                    attributes: ['USER_ID']
                },
                {
                    model: userModel,
                    as: 'Publisher',
                    attributes: ['USER_ID']
                },
                {
                    model: officeModel,
                    attributes: ['OFFICE_ID']
                }
            ]
        });
        res.json(posts);
    } catch (error) {
        res.status(500).json({
            message: 'Error: ' + error
        });
    }
}

/**
 * @description Retrieves a specific post by its ID from the database.
 * 
 * This function uses Sequelize's `findOne` method to fetch a specific post 
 * from the 'Posts' table by its ID, including associated sub-area, admin, publisher, and office information. 
 * The result is returned as a JSON response. In case of an error, an error message 
 * is returned with HTTP status 500.
 * 
 * @async
 * @function getPost
 * @route {GET} /posts/:id
 * @param {Object} req - The HTTP request object.
 * @param {Object} req.params - The URL parameters.
 * @param {number} req.params.id - The ID of the post.
 * @param {Object} res - The HTTP response object.
 * @returns {Promise<void>} A promise that resolves with no return value.
 */
postsController.getPost = async (req, res) => {
    const { id } = req.params;
    try {
        const post = await postsModel.findOne({
            where: {
                POST_ID: id
            },
            include: [
                {
                    model: subAreaModel,
                    attributes: ['SUB_AREA_ID', 'SUB_AREA_NAME']
                },
                {
                    model: userModel,
                    as: 'Admin',
                    attributes: ['USER_ID', 'USERNAME']
                },
                {
                    model: userModel,
                    as: 'Publisher',
                    attributes: ['USER_ID', 'USERNAME']
                },
                {
                    model: officeModel,
                    attributes: ['OFFICE_ID', 'OFFICE_NAME']
                }
            ]
        });
        res.json(post);
    } catch (error) {
        res.status(500).json({
            message: 'Error: ' + error
        });
    }
}

/**
 * @description Creates a new post record in the database.
 * 
 * This function uses Sequelize's `create` method to add a new post 
 * to the 'Posts' table. It takes the post data from the request body. 
 * If the operation is successful, a success message and the newly created 
 * post data are returned as a JSON response. In case of an error, 
 * an error message is returned with HTTP status 500.
 * 
 * @async
 * @function createPost
 * @route {POST} /posts/create
 * @param {Object} req - The HTTP request object.
 * @param {Object} req.body - The body of the request containing post data.
 * @param {number} req.body.SUB_AREA_ID - The ID of the sub-area.
 * @param {number} req.body.OFFICE_ID - The ID of the office.
 * @param {number} req.body.ADMIN_ID - The ID of the admin.
 * @param {number} req.body.PUBLISHER_ID - The ID of the publisher.
 * @param {string} req.body.TYPE - The type of the post.
 * @param {boolean} req.body.VALIDATED - The validation status of the post.
 * @param {string} req.body.TITLE - The title of the post.
 * @param {string} req.body.CONTENT - The content of the post.
 * @param {string} req.body.P_LOCATION - The location of the post.
 * @param {string} req.body.FILEPATH - The file path of the post.
 * @param {Object} res - The HTTP response object.
 * @returns {Promise<void>} A promise that resolves with no return value.
 */
postsController.createPost = async (req, res) => {
    const { SUB_AREA_ID, OFFICE_ID, ADMIN_ID, PUBLISHER_ID, TYPE, VALIDATED, TITLE, CONTENT, P_LOCATION, FILEPATH } = req.body;
    try {
        const newPost = await postsModel.create({
            SUB_AREA_ID,
            OFFICE_ID,
            ADMIN_ID,
            PUBLISHER_ID,
            TYPE,
            VALIDATED,
            TITLE,
            CONTENT,
            P_LOCATION,
            FILEPATH
        });
        res.json({ message: 'New Post Created', post: newPost });
    } catch (error) {
        res.status(500).json({
            message: 'Error: ' + error
        });
    }
}

/**
 * @description Updates an existing post record in the database.
 * 
 * This function uses Sequelize's `update` method to modify an existing post 
 * in the 'Posts' table. It takes the post data from the request body 
 * and the ID of the post from the URL parameters. If the operation is successful, 
 * a success message is returned as a JSON response. In case of an error, 
 * an error message is returned with HTTP status 500.
 * 
 * @async
 * @function updatePost
 * @route {PUT} /posts/update/:id
 * @param {Object} req - The HTTP request object.
 * @param {Object} req.params - The URL parameters.
 * @param {number} req.params.id - The ID of the post.
 * @param {Object} req.body - The body of the request containing post data.
 * @param {number} req.body.SUB_AREA_ID - The ID of the sub-area.
 * @param {number} req.body.OFFICE_ID - The ID of the office.
 * @param {number} req.body.ADMIN_ID - The ID of the admin.
 * @param {number} req.body.PUBLISHER_ID - The ID of the publisher.
 * @param {string} req.body.TYPE - The type of the post.
 * @param {boolean} req.body.VALIDATED - The validation status of the post.
 * @param {string} req.body.TITLE - The title of the post.
 * @param {string} req.body.CONTENT - The content of the post.
 * @param {string} req.body.P_LOCATION - The location of the post.
 * @param {string} req.body.FILEPATH - The file path of the post.
 * @param {Object} res - The HTTP response object.
 * @returns {Promise<void>} A promise that resolves with no return value.
 */
postsController.updatePost = async (req, res) => {
    const { id } = req.params;
    const { SUB_AREA_ID, OFFICE_ID, ADMIN_ID, PUBLISHER_ID, TYPE, VALIDATED, TITLE, CONTENT, P_LOCATION, FILEPATH } = req.body;
    try {
        await postsModel.update({
            SUB_AREA_ID,
            OFFICE_ID,
            ADMIN_ID,
            PUBLISHER_ID,
            TYPE,
            VALIDATED,
            TITLE,
            CONTENT,
            P_LOCATION,
            FILEPATH
        }, {
            where: {
                POST_ID: id
            }
        });
        res.json({ message: 'Post Updated' });
    } catch (error) {
        res.status(500).json({
            message: 'Error: ' + error
        });
    }
}

/**
 * @description Deletes a post record from the database by its ID.
 * 
 * This function uses Sequelize's `destroy` method to remove a post 
 * from the 'Posts' table by its ID. If the operation is successful, 
 * a success message is returned as a JSON response. In case of an error, 
 * an error message is returned with HTTP status 500.
 * 
 * @async
 * @function deletePost
 * @route {DELETE} /posts/delete/:id
 * @param {Object} req - The HTTP request object.
 * @param {Object} req.params - The URL parameters.
 * @param {number} req.params.id - The ID of the post.
 * @param {Object} res - The HTTP response object.
 * @returns {Promise<void>} A promise that resolves with no return value.
 */
postsController.deletePost = async (req, res) => {
    const { id } = req.params;
    try {
        await postsModel.destroy({
            where: {
                POST_ID: id
            }
        });
        res.json({ message: 'Post Deleted' });
    } catch (error) {
        res.status(500).json({
            message: 'Error: ' + error
        });
    }
}

module.exports = postsController;
