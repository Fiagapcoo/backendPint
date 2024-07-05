const { spCreateEvent, 
    spEventParticipationCleanup,
    spRegisterUserForEvent,
    spUnregisterUserFromEvent,
    fnGetEventState,
    spEditEvent,
    spGetEvent } = require('../database/logic_objects/eventProcedures');

const controllers = {};

controllers.create_event = async (req, res) => {
    const { officeId, subAreaId, name, description, eventDate, recurring=false, recurring_pattern='{"key": ""}', max_participants=null, location, publisher_id, filePath } = req.body; 
    console.log(req.query);
    try {
        await spCreateEvent(officeId, subAreaId, name, description, eventDate, recurring, recurring_pattern, max_participants, location, publisher_id, filePath);
        res.status(201).json({success:true, message:'Event created successfully.'});
    } catch (error) {
        res.status(500).json({success:false, message:'Error creating Event: ' + error.message});
    }
};

//function INSIDE CONTROLLER TO BE CALLED AFTER SETTING AN USER INACTIVE
/* controllers.event_participation_cleanup = async (req, res) => {
    const { } = req.query; 
    console.log(req.query);
    try {
        await spEventParticipationCleanup(subAreaId, title, description, publisher_id, eventId);
        res.status(201).send('Events participation cleaned up succesffuly.');
    } catch (error) {
        res.status(500).send('Error cleaning event participation: ' + error.message);
    }
};
*/

controllers.register_user_for_event = async (req, res) => {
    const { userId, eventId } = req.params; 
    console.log(req.params);
    try {
        await spRegisterUserForEvent(userId, eventId);
        res.status(201).json({success:true, message:'Registered for event successfully.'});
    } catch (error) {
        res.status(500).json({success:false, message:'Error registering for event: ' + error.message});
    }
};

controllers.unregister_user_from_event = async (req, res) => {
    const { userId, eventId } = req.params; 
    console.log(req.params);
    try {
        await spUnregisterUserFromEvent(userId, eventId);
        res.status(201).json({success:true, message:'Unregistered from event successfully.'});
    } catch (error) {
        res.status(500).json({success:false, message:'Error unregistering from event: ' + error.message});
    }
};

controllers.get_event_state = async (req, res) => {
    const { eventId } = req.params; 
    console.log(req.params);
    try {
        const state = await fnGetEventState(eventId);
        res.status(201).json({success:true, message:'Got event state successfully.', data: state});
    } catch (error) {
        res.status(500).json({success:false, message:'Error getting event state: ' + error.message});
    }
};

controllers.edit_event = async (req, res) => {
    const { eventId } = req.params
    const {  subAreaId = null, officeId = null, adminId = null, name = null, description = null, eventDate = null, eventLocation = null, 
        filePath = null, recurring = null, recurringPattern = null, maxParticipants = null, currentParticipants = null } = req.body; 
    console.log(req.query);
    try {
        await spEditEvent(eventId, subAreaId, officeId, adminId, name, description , eventDate, eventLocation, 
                            filePath, recurring, recurringPattern, maxParticipants, currentParticipants);
                            
        res.status(201).json({success:true, message:'Forum edited successfully.'});
    } catch (error) {
        res.status(500).json({success:false, message:'Error creating Forum: ' + error.message});
    }
};

controllers.get_event = async (req, res) => {
    const { eventId } = req.params; 
    console.log(req.params);
    try {
        const event = await spGetEvent(eventId);
        res.status(201).json({success:true, message:'Got event successfully.', data: event});
    } catch (error) {
        res.status(500).json({success:false, message:'Error getting event: ' + error.message});
    }
}

module.exports = controllers;
