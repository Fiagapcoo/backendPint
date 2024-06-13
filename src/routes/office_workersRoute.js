const express = require('express');
const Router = express.Router();

const office_workersController = require('../controllers/office_workersController');

Router.get('/list', office_workersController.list);
Router.get('/get/:id', office_workersController.get);
Router.put('/update/:id', office_workersController.update);
Router.post('/create', office_workersController.create);
Router.delete('/delete/:id', office_workersController.delete);

module.exports = Router;
