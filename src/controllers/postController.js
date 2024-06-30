const { spCreatePost, 
        fnGetPostState, 
        spEditPost } = require('../database/logic_objects/postProcedures');

const controllers = {};

controllers.create_post = async (req, res) => {
    const { subAreaId, officeId, publisher_id, title, content, pLocation, filePath, type='N', rating=null } = req.body; 
    console.log(req.query);
    try {
        await spCreatePost(subAreaId, officeId, publisher_id, title, content, pLocation, filePath, type, rating);
        res.status(201).send('Post created successfully.');
    } catch (error) {
        res.status(500).send('Error creating Post: ' + error.message);
    }
};

controllers.edit_post = async (req, res) => {
    const { postId } = req.param
    const {  subAreaId = null, officeId = null, adminId = null, title = null, content = null, pLocation = null, filePath = null, type = null } = req.body; 
    console.log(req.query);
    try {
        await spEditPost(postId, subAreaId, officeId, adminId, title, content, pLocation, filePath, type);
        res.status(201).send('Post edited successfully.');
    } catch (error) {
        res.status(500).send('Error editing Post: ' + error.message);
    }
};

controllers.get_post_state = async (req, res) => {
    const { postId } = req.param; 
    console.log(req.param);
    try {
        await fnGetPostState(postId);
        res.status(201).send('Got post state successfully.');
    } catch (error) {
        res.status(500).send('Error getting Post state: ' + error.message);
    }
};

module.exports = controllers;