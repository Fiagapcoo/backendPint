const express = require('express');
const Router = express.Router();

const postsController = require('../controllers/postsController');

Router.get('/list', postsController.getPosts);
Router.get('/get/:id', postsController.getPost);
Router.post('/create', postsController.createPost);
Router.put('/update/:id', postsController.updatePost);
Router.delete('/delete/:id', postsController.deletePost);

module.exports = Router;