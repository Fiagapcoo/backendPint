const express = require('express');
const router = express.Router();

const EventController = require('../controllers/eventsController');

router.post('/create', EventController.createEvent);
router.get('/list', EventController.getAllEvents);
router.get('/get/:id', EventController.getEventById);
router.put('/update/:id', EventController.updateEvent);
router.delete('/delete/:id', EventController.deleteEvent);

module.exports = router;
