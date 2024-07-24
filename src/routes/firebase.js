const express = require("express");
const db = require('../../models'); 
const router = express.Router();
  
  
  
  // Store FCM token
  router.post('/api/store-token', async (req, res) => {
    const { userId, token } = req.body;
    try {
      // Store the token in the database (assuming Sequelize ORM)
      await db.User.update({ fcmToken: token }, { where: { id: userId } });
      res.status(200).send('Token stored successfully');
    } catch (error) {
      console.error('Error storing token:', error);
      res.status(500).send('Internal server error');
    }
  });


  module.exports = router;