const { getUserPreferences,
        updateUserPreferences,
        updateAccessOnLogin,
        getUserRole,
        addBookmark,   
        removeBookmark, 
        getUserBookmarks } = require('../database/logic_objects/usersProcedures');

const controllers = {};

controllers.get_user_preferences = async (req, res) => {
    const { userID } = req.param; 
    console.log(req.param );
    try {
        await getUserPreferences(userID);
        res.status(201).send('Forum created successfully.');
    } catch (error) {
        res.status(500).send('Error creating Forum: ' + error.message);
    }
};


controllers.update_user_preferences = async (req, res) => {
    const { userID} = req.param; 
    const {  preferredLanguageID = null, preferredAreas = null, preferredSubAreas = null, receiveNotifications = null } = req.body; 
    console.log(req.query);
    try {
        await updateUserPreferences(userID, preferredLanguageID, preferredAreas, preferredSubAreas, receiveNotifications);
        res.status(201).send('Forum created successfully.');
    } catch (error) {
        res.status(500).send('Error creating Forum: ' + error.message);
    }
};

//change this controller later as to not be a controller maybe?
controllers.update_access_on_login = async (req, res) => {
    const { userID } = req.param; 
    console.log(req.param);
    try {
        await updateAccessOnLogin(userID);
        res.status(201).send('Forum created successfully.');
    } catch (error) {
        res.status(500).send('Error creating Forum: ' + error.message);
    }
};

controllers.get_user_role = async (req, res) => {
    const { userID } = req.params; 
    console.log(req.query);
    try {
        await getUserRole(userID);
        res.status(201).send(' Got User Role successfully.');
    } catch (error) {
        res.status(500).send('Error getting user role: ' + error.message);
    }
};

controllers.add_bookmark = async (req, res) => {
    const { userID, contentID, contentType } = req.param; 
    console.log(req.param);
    try {
        await addBookmark(userID, contentID, contentType);
        res.status(201).send('Forum created successfully.');
    } catch (error) {
        res.status(500).send('Error creating Forum: ' + error.message);
    }
};

   

controllers.remove_bookmark = async (req, res) => {
    const { userID, contentID, contentType } = req.param; 
    console.log(req.param);
    try {
        await removeBookmark(userID, contentID, contentType);
        res.status(201).send('Forum created successfully.');
    } catch (error) {
        res.status(500).send('Error creating Forum: ' + error.message);
    }
};

controllers.get_user_bookmarks = async (req, res) => {
    const { userID } = req.param; 
    console.log(req.param);
    try {
        await getUserBookmarks(userID);
        res.status(201).send('Forum created successfully.');
    } catch (error) {
        res.status(500).send('Error creating Forum: ' + error.message);
    }
};

module.exports = controllers;
