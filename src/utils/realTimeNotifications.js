const admin = require('../server');

const {findUserById} = require("../database/logic_objects/usersProcedures");
// Function to send a notification when someone replies to a comment
const sendReplyNotification = async (replyToUserId, commentId, replierName) => {
    const user = await findUserById(replyToUserId);
    if (!user || !user.fcmToken) return;
  
    const payload = {
      notification: {
        title: "New Reply to Your Comment",
        body: `${replierName} replied to your comment.`,
      },
      token: user.fcmToken,
      data: {
        commentId: String(commentId),
      },
    };
  
    await admin.messaging().send(payload);
  };
  
  // Function to send a notification when someone likes a comment
  const sendLikeNotification = async (commentOwnerId, likerName) => {
    const user = await findUserById(commentOwnerId);
    if (!user || !user.fcmToken) return;
  
    const payload = {
      notification: {
        title: "Your Comment was Liked",
        body: `${likerName} liked your comment.`,
      },
    };
  
    await admin.messaging().sendToDevice(user.fcmToken, payload);
  };
  
  // Function to send a notification when someone comments on a post or forum you created
  const sendNewCommentNotification = async (postOwnerId, postId, contentType, commenterName) => {
    const user = await findUserById(postOwnerId);
    if (!user || !user.fcmToken) return;
  
    const payload = {
      notification: {
        title: "New Comment on Your Publication",
        body: `${commenterName} commented on your ${contentType}.`,
      },
      data: {
        postId: String(postId),
      },
    };
  
    await admin.messaging().sendToDevice(user.fcmToken, payload);
  };
  
  // Function to send a notification when someone registers for an event you created
  const sendEventRegistrationNotification = async (eventOwnerId, eventId, registrantName) => {
    const user = await findUserById(eventOwnerId);
    if (!user || !user.fcmToken) return;
  
    const payload = {
      notification: {
        title: "New Event Registration",
        body: `${registrantName} registered for your event.`,
      },
      data: {
        eventId: String(eventId),
      },
    };
  
    await admin.messaging().sendToDevice(user.fcmToken, payload);
  };
  
  module.exports = {
    sendReplyNotification,
    sendLikeNotification,
    sendNewCommentNotification,
    sendEventRegistrationNotification,
  };