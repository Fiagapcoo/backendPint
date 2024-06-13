const postsModel = require('../models/posts');
const subAreaModel = require('../models/sub_area');
const userModel = require('../models/users');
const officeModel = require('../models/office_admins');
const postsController = {};

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
                    attributes: ['OFFICE_ID',]
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
