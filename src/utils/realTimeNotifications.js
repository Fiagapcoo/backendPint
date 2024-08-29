const admin = require('../server');


// Function to send a notification when someone replies to a comment
const sendReplyNotification = async (replyToUserId, commentId, replierName) => {
    const user = await db.Users.findByPk(replyToUserId);
    if (!user || !user.fcmToken) return;
  
    const payload = {
      notification: {
        title: "New Reply to Your Comment",
        body: `${replierName} replied to your comment.`,
      },
      data: {
        commentId: String(commentId),
      },
    };
  
    await admin.messaging().sendToDevice(user.fcmToken, payload);
  };
  
  // Function to send a notification when someone likes a comment
  const sendLikeNotification = async (commentOwnerId, likerName) => {
    const user = await db.Users.findByPk(commentOwnerId);
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
  const sendNewCommentNotification = async (postOwnerId, postId, commenterName) => {
    const user = await db.Users.findByPk(postOwnerId);
    if (!user || !user.fcmToken) return;
  
    const payload = {
      notification: {
        title: "New Comment on Your Post",
        body: `${commenterName} commented on your post.`,
      },
      data: {
        postId: String(postId),
      },
    };
  
    await admin.messaging().sendToDevice(user.fcmToken, payload);
  };
  
  // Function to send a notification when someone registers for an event you created
  const sendEventRegistrationNotification = async (eventOwnerId, eventId, registrantName) => {
    const user = await db.Users.findByPk(eventOwnerId);
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