const express = require('express');
const Router = express.Router();

const office_adminsController = require('../controllers/office_adminsController');

Router.get('/list', office_adminsController.list);
Router.get('/get/:id', office_adminsController.get);
Router.put('/update/:id', office_adminsController.update);
Router.post('/create', office_adminsController.create);
Router.delete('/delete/:id', office_adminsController.delete);

module.exports = Router;