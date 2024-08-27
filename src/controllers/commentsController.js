const {
  spAddComment,
  getCommentTree,
  likeComment,
  unlikeComment,
  reportComment,
} = require("../database/logic_objects/commentsProcedures");
const validator = require("validator");
const controllers = {};
const {
  sendCommentforumNotif,
  sendCommentpostNotif,
} = require("../websockets");
controllers.add_comment = async (req, res) => {
  const {
    parentCommentID = null,
    contentID,
    contentType,
    userID,
    commentText,
  } = req.body;
  console.log(req.query);

  // Validate inputs
  if (parentCommentID && !validator.isInt(parentCommentID.toString())) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid parent comment ID" });
  }
  if (!validator.isInt(contentID.toString())) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid content ID" });
  }
  if (!validator.isIn(contentType, ["Post", "Forum"])) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid content type" });
  }
  if (!validator.isInt(userID.toString())) {
    return res.status(400).json({ success: false, message: "Invalid user ID" });
  }
  if (validator.isEmpty(commentText)) {
    return res
      .status(400)
      .json({ success: false, message: "Comment text cannot be empty" });
  }
  //const intContID = parseInt(contentID);
  try {
    var id = await spAddComment({
      parentCommentID,
      contentID,
      contentType,
      userID,
      commentText,
    });
    if (contentType == "Post") {
      sendCommentpostNotif({
        post_id: contentID,
        comment_id: id,
        content: commentText,
      });
    }
    if (contentType == "Forum") {
      sendCommentforumNotif({
        forum_id: contentID,
        comment_id: id,
        content: commentText,
      });
    }
    res
      .status(201)
      .json({ success: true, message: "Comment added successfully." });
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        message: "Error adding Comment: " + error.message,
      });
  }
};

controllers.get_comments_tree = async (req, res) => {
  const { contentID, contentType } = req.params;
  console.log(req.params);

  // Validate inputs
  if (!validator.isInt(contentID.toString())) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid content ID" });
  }
  if (!validator.isIn(contentType, ["post", "forum"])) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid content type" });
  }

  try {
    const comments = await getCommentTree(contentID, contentType);
    res
      .status(201)
      .json({
        success: true,
        data: comments,
        message: "Got comments tree successfully.",
      });
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        message: "Error getting comments tree: " + error.message,
      });
  }
};

controllers.like_comment = async (req, res) => {
  const { commentID, userID } = req.body;
  console.log(req.body);

  try {
    const comments = await likeComment(commentID, userID);
    res
      .status(201)
      .json({
        success: true,
        data: comments,
        message: "Liked comment successfuly.",
      });
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        message: "Error liking comment: " + error.message,
      });
  }
};
controllers.unlike_comment = async (req, res) => {
  const { commentID, userID } = req.body;
  console.log(req.body);

  try {
    const comments = await unlikeComment(commentID, userID);
    res
      .status(201)
      .json({
        success: true,
        data: comments,
        message: "Liked comment successfuly.",
      });
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        message: "Error liking comment: " + error.message,
      });
  }
};

controllers.report_comment = async (req, res) => {
  const { commentID, reporterID, observation } = req.body;
  console.log(req.body);

  try {
    const comments = await reportComment(commentID, reporterID, observation);
    res
      .status(201)
      .json({
        success: true,
        data: comments,
        message: "Reported comment successfully.",
      });
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        message: "Error reporting comment: " + error.message,
      });
  }
};

module.exports = controllers;
