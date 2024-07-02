const { getUserPreferences,
        updateUserPreferences,
        updateAccessOnLogin,
        getUserRole,
        addBookmark,   
        removeBookmark, 
        getUserBookmarks,
        getUserByRole } = require('../database/logic_objects/usersProcedures');


const controllers = {};

controllers.get_user_preferences = async (req, res) => {
    const { userID } = req.params; 
    console.log(req.params);
    try {
        data = await getUserPreferences(userID);
        res.status(201).json({success:true, data:data, message:' Got User preferences successfully.'} );
    } catch (error) {
        res.status(500).send('Error getting user preferences: ' + error.message);
    }
};


controllers.update_user_preferences = async (req, res) => {
    const { userID} = req.params; 
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
    const { userID } = req.params; 
    console.log(req.params);
    try {
        await updateAccessOnLogin(userID);
        res.status(201).send(' Update user last access login successfully.');
    } catch (error) {
        res.status(500).send('Error updating user last access on login: ' + error.message);
    }
};

controllers.get_user_role = async (req, res) => {
    const { userID } = req.params; 
    console.log(req.query);
    try {
        data = await getUserRole(userID);
        res.status(201).json({success:true, data:data, message:' Got User Role successfully.'} );
    } catch (error) {
        res.status(500).send('Error getting user role: ' + error.message);
    }
};

controllers.get_user_by_role = async (req, res) => {
    const { role } = req.params; 
    console.log(req.params);
    try {
        data = await getUserByRole(role);
        res.status(201).json({success:true, data:data, message:' Got User by Role successfully.'} );
    } catch (error) {
        res.status(500).send('Error getting user by role: ' + error.message);
    }
}

controllers.add_bookmark = async (req, res) => {
    const { userID, contentID, contentType } = req.body; 
    console.log(req.body);
    try {
        await addBookmark(userID, contentID, contentType);
        res.status(201).send('Forum created successfully.');
    } catch (error) {
        res.status(500).send('Error creating Forum: ' + error.message);
    }
};

   

controllers.remove_bookmark = async (req, res) => {
    const { userID, contentID, contentType } = req.params; 
    console.log(req.params);
    try {
        await removeBookmark(userID, contentID, contentType);
        res.status(201).send('Forum created successfully.');
    } catch (error) {
        res.status(500).send('Error creating Forum: ' + error.message);
    }
};

controllers.get_user_bookmarks = async (req, res) => {
    const { userID } = req.params; 
    console.log(req.params);
    try {
        await getUserBookmarks(userID);
        res.status(201).send('Forum created successfully.');
    } catch (error) {
        res.status(500).send('Error creating Forum: ' + error.message);
    }
};

module.exports = controllers;
