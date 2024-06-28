const { spCreateForum, 
        spCreateForumForEvent, 
        fnGetForumState, 
        spEditForum } = require('../database/logic_objects/forumProcedures');

const controllers = {};

controllers.create_forum = async (req, res) => {
    const { officeID, subAreaId, title, description, publisher_id } = req.query; 
    console.log(req.query);
    try {
        await spCreateForum(officeID, subAreaId, title, description, publisher_id);
        res.status(201).send('Forum created successfully.');
    } catch (error) {
        res.status(500).send('Error creating Forum: ' + error.message);
    }
};

controllers.create_forum_for_event = async (req, res) => {
    const { subAreaId, title, description, publisher_id, eventId } = req.query; 
    console.log(req.query);
    try {
        await spCreateForumForEvent(subAreaId, title, description, publisher_id, eventId);
        res.status(201).send('Forum for event created successfully.');
    } catch (error) {
        res.status(500).send('Error creating Forum for event: ' + error.message);
    }
};

controllers.get_forum_state = async (req, res) => {
    const { forumId } = req.param; 
    console.log(req.param);
    try {
        await fnGetForumState(forumId);
        res.status(201).send('Got Forum state successfully.');
    } catch (error) {
        res.status(500).send('Error getting Forum state: ' + error.message);
    }
};

controllers.edit_forum = async (req, res) => {
    const { forumId } = req.param;
    const {  subAreaId = null, officeId = null, adminId = null, title = null, content = null, eventId = null } = req.body; 
    console.log(req.query);
    try {
        await spEditForum(forumId, subAreaId, officeId, adminId, title, content, eventId );
        res.status(201).send('Forum edited successfully.');
    } catch (error) {
        res.status(500).send('Error creating Forum: ' + error.message);
    }
};

module.exports = controllers;
