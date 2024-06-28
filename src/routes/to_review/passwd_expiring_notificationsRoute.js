const express = require('express');
const Router = express.Router();

const passwd_expiring_notificationsController = require('../controllers/passwd_expiring_notificationsController');

Router.get('/list', passwd_expiring_notificationsController.list);
Router.get('/get/:id', passwd_expiring_notificationsController.get);
Router.put('/update/:id', passwd_expiring_notificationsController.update);
Router.post('/create', passwd_expiring_notificationsController.create);


module.exports = Router;