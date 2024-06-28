const { addComment,
        getCommentTree } = require('../database/logic_objects/commentsProcedures');

const controllers = {};

controllers.add_comment = async (req, res) => {
    const { parentCommentID = null, contentID, contentType, userID, commentText } = req.query; 
    console.log(req.query);
    try {
        await addComment({ parentCommentID, contentID, contentType, userID, commentText });
        res.status(201).send('Commentary added successfully.');
    } catch (error) {
        res.status(500).send('Error adding Commentary: ' + error.message);
    }
};

controllers.get_comments_tree = async (req, res) => {
    const { contentID, contentType } = req.param; 
    console.log(req.param);
    try {
        await getCommentTree(contentID, contentType);
        res.status(201).send('Got comments tree successfully.');
    } catch (error) {
        res.status(500).send('Error getting comments tree: ' + error.message);
    }
};

module.exports = controllers;
