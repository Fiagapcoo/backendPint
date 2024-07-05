const { addComment,
        getCommentTree } = require('../database/logic_objects/commentsProcedures');
const validator = require('validator');
const controllers = {};

controllers.add_comment = async (req, res) => {
    const { parentCommentID = null, contentID, contentType, userID, commentText } = req.body; 
    console.log(req.query);

    // Validate inputs
    if (parentCommentID && !validator.isInt(parentCommentID.toString())) {
        return res.status(400).json({ success: false, message: 'Invalid parent comment ID' });
    }
    if (!validator.isInt(contentID.toString())) {
        return res.status(400).json({ success: false, message: 'Invalid content ID' });
    }
    if (!validator.isIn(contentType, ['post', 'forum'])) {
        return res.status(400).json({ success: false, message: 'Invalid content type' });
    }
    if (!validator.isInt(userID.toString())) {
        return res.status(400).json({ success: false, message: 'Invalid user ID' });
    }
    if (validator.isEmpty(commentText)) {
        return res.status(400).json({ success: false, message: 'Comment text cannot be empty' });
    }

    try {
        await spAddComment({ parentCommentID, contentID, contentType, userID, commentText });
        res.status(201).json({success:true, message:'Commentary added successfully.'});
    } catch (error) {
        res.status(500).json({success:false, message:'Error adding Commentary: ' + error.message});
    }
};

controllers.get_comments_tree = async (req, res) => {
    const { contentID, contentType } = req.params; 
    console.log(req.params);

    // Validate inputs
    if (!validator.isInt(contentID.toString())) {
        return res.status(400).json({ success: false, message: 'Invalid content ID' });
    }
    if (!validator.isIn(contentType, ['post', 'forum'])) {
        return res.status(400).json({ success: false, message: 'Invalid content type' });
    }

    try {
        const comments = await getCommentTree(contentID, contentType);
        res.status(201).json({success: true, data: comments, message:'Got comments tree successfully.'});
    } catch (error) {
        res.status(500).json({success:false, message:'Error getting comments tree: ' + error.message});
    }
};

module.exports = controllers;
