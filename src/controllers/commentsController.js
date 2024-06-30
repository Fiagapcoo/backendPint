const { addComment,
        getCommentTree } = require('../database/logic_objects/commentsProcedures');

const controllers = {};

controllers.add_comment = async (req, res) => {
    const { parentCommentID = null, contentID, contentType, userID, commentText } = req.body; 
    console.log(req.query);
    try {
        await addComment({ parentCommentID, contentID, contentType, userID, commentText });
        res.status(201).json({success:true, message:'Commentary added successfully.'});
    } catch (error) {
        res.status(500).json({success:false, message:'Error adding Commentary: ' + error.message});
    }
};

controllers.get_comments_tree = async (req, res) => {
    const { contentID, contentType } = req.params; 
    console.log(req.params);
    try {
        const comments = await getCommentTree(contentID, contentType);
        res.status(201).json({success: true, data: comments, message:'Got comments tree successfully.'});
    } catch (error) {
        res.status(500).json({success:false, message:'Error getting comments tree: ' + error.message});
    }
};

module.exports = controllers;
