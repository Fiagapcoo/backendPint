const db = require('../models'); 
const { QueryTypes } = require('sequelize');
const validator = require('validator');
const controllers = {};

controllers.getAllContent = async (req, res) => {
    try {
        const posts = await db.Posts.findAll({ order: [['creation_date', 'DESC']] });
        const forums = await db.Forums.findAll({ order: [['creation_date', 'DESC']] });
        const events = await db.Events.findAll({ order: [['creation_date', 'DESC']] });
        res.status(200).json({ posts, forums, events });
    } catch (error) {
        res.status(500).json({success:false, message:'Error retrieving content: ' + error.message});
    }
};

controllers.getPostsByCity = async (req, res) => {
    const { city_id } = req.params;
    if (!validator.isInt(city_id)) {
        return res.status(400).json({ success: false, message: 'Invalid city ID' });
    }
    try {
        const posts = await db.sequelize.query(`
            SELECT p.*, o.city
            FROM "dynamic_content"."posts" p
            JOIN "centers"."offices" o ON p.office_id = o.office_id
            WHERE o.office_id = :city_id
            ORDER BY p.creation_date DESC
        `, {
            replacements: { city_id },
            type: QueryTypes.SELECT
        });
        res.status(200).json({success:true , data:posts});
    } catch (error) {
        res.status(500).json({success:false, message:'Error retrieving posts: ' + error.message});
    }
};

controllers.getForumsByCity = async (req, res) => {
    const { city_id } = req.params;
    if (!validator.isInt(city_id)) {
        return res.status(400).json({ success: false, message: 'Invalid city ID' });
    }
    try {
        const forums = await db.sequelize.query(`
            SELECT f.*, o.city
            FROM "dynamic_content"."forums" f
            JOIN "centers"."offices" o ON f.office_id = o.office_id
            WHERE o.office_id = :city_id
            ORDER BY f.creation_date DESC
        `, {
            replacements: { city_id },
            type: QueryTypes.SELECT
        });
        res.status(200).json({success:true , data: forums});
    } catch (error) {
        res.status(500).json({success:false, message:'Error retrieving forums: ' + error.message});
    }
};

controllers.getEventsByCity = async (req, res) => {
    const { city_id } = req.params;
    if (!validator.isInt(city_id)) {
        return res.status(400).json({ success: false, message: 'Invalid city ID' });
    }
    try {
        const events = await db.sequelize.query(`
            SELECT e.*, o.city
            FROM "dynamic_content"."events" e
            JOIN "centers"."offices" o ON e.office_id = o.office_id
            WHERE o.office_id = :city_id
            ORDER BY e.creation_date DESC
        `, {
            replacements: { city_id },
            type: QueryTypes.SELECT
        });
            res.status(200).json({success:true , data: events});
    } catch (error) {
        res.status(500).json({success:false, message:'Error retrieving events: ' + error.message});
    }
};

controllers.getPostById = async (req, res) => {
    const { post_id } = req.params;
    if (!validator.isInt(post_id)) {
        return res.status(400).json({ success: false, message: 'Invalid post ID' });
    }
    try {
        const post = await db.Posts.findByPk(post_id, {
            include: [
                { model: db.Users, as: 'Publisher' },
                { model: db.Users, as: 'Admin' },
                { model: db.SubArea },
                { model: db.OfficeAdmins, as: 'Office' },
                { model: db.Scores, as: 'Score', attributes: ['score', 'num_of_evals'] }
            ]
        });

        if (post) {
            res.status(200).json(post);
        } else {
            res.status(404).json({success:false, message:'Post not found'});
        }
    } catch (error) {
        res.status(500).json({success:false, message:'Error retrieving post: ' + error.message});
    }
};

// to test 
controllers.getEventByIdNoRawQuery = async (req, res) => {
    const { event_id } = req.params;
    const user_id = req.user.id; // Extracted from JWT 
    if (!validator.isInt(event_id)) {
        return res.status(400).json({ success: false, message: 'Invalid event ID' });
    }
    try {
        const event = await db.Events.findByPk(event_id, {
            include: [
                { model: db.Users, as: 'Publisher' },
                { model: db.OfficeAdmins, as: 'Office' },
                { model: db.Users, as: 'Admin' },
                { model: db.Scores, as: 'Score', attributes: ['score', 'num_of_evals'] },
                {
                    model: db.Forums,
                    where: { event_id: event_id },
                    required: false,
                    include: [
                        {
                            model: db.EventForumAccess,
                            where: { user_id: user_id },
                            required: false,
                            as: 'UserAccess'
                        }
                    ]
                }
            ]
        });

        if (event) {
            res.status(200).json(event);
        } else {
            res.status(404).json({ success: false, message: 'Event not found' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error retrieving event', error: error.message });
    }
};


controllers.getEventById = async (req, res) => {
    const { event_id } = req.params;
    const user_id = req.user.id; // Extracted from JWT 
    if (!validator.isInt(event_id)) {
        return res.status(400).json({ success: false, message: 'Invalid event ID' });
    }
    try {
        const event = await db.Events.findByPk(event_id, {
            include: [
                { model: db.Users, as: 'Publisher' },
                { model: db.OfficeAdmins, as: 'Office' },
                { model: db.Users, as: 'Admin' },
                { model: db.Scores, as: 'Score', attributes: ['score', 'num_of_evals'] }
            ]
        });

        if (!event) {
            return res.status(404).json({ success: false, message: 'Event not found' });
        }

        // Check if the user is registered for the event
        const participationExists = await db.sequelize.query(
            `SELECT 1
            FROM "control"."participation"
            WHERE "user_id" = :user_id AND "event_id" = :eventId`,
            { replacements: { user_id, eventId: event_id }, type: QueryTypes.SELECT }
        );

        // If user is registered, fetch the forum details
        let forum = null;
        if (participationExists.length > 0) {
            const forumResult = await db.sequelize.query(
                `SELECT "forum_id", "title", "content", "creation_date"
                FROM "dynamic_content"."forums"
                WHERE "event_id" = :eventId`,
                { replacements: { eventId: event_id }, type: QueryTypes.SELECT }
            );

            if (forumResult.length > 0) {
                forum = forumResult[0];
            }
        }

        // Construct the response
        const response = {
            event,
            forum
        };

        res.status(200).json({success:true, data: response});


 
    } catch (error) {
        res.status(500).json({success:false, message: 'Error retrieving event', error: error.message });
    }
};

controllers.getForumById = async (req, res) => {
    const { forum_id } = req.params;
    if (!validator.isInt(forum_id)) {
        return res.status(400).json({ success: false, message: 'Invalid forum ID' });
    }
    try {
        const forum = await db.Forums.findByPk(forum_id, {
            include: [
                { model: db.Users, as: 'Publisher' },
                { model: db.Users, as: 'Admin' },
                { model: db.SubArea },
                { model: db.Events }
            ]
        });

        if (forum) {
            res.status(200).json(forum);
        } else {
            res.status(404).json({success:false, message:'Forum not found'});
        }
    } catch (error) {
        res.status(500).json({success:false, message:'Error retrieving forum: ' + error.message});
    }
};

controllers.getUserInfo = async (req, res) => {
    const { user_id } = req.params;
    if (!validator.isInt(user_id)) {
        return res.status(400).json({ success: false, message: 'Invalid user ID' });
    }
    try {
        const user = await db.Users.findByPk(user_id , {
            attributes: { exclude: ['hashed_password', 'join_date', 'profile_pic'] },
            include: [
                {
                    model: db.OfficeWorkers,
                    as: 'OfficeWorker',
                    include: [
                        {
                            model: db.Offices,
                            as: 'Office',
                            attributes: ['office_id', 'city']
                        }
                    ]
                }
            ]
            
        });
        if (user) {
            res.status(200).json({ success: true, data: user });
        } else {
            res.status(404).json({ success: false, message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({success:false, message:'Error retrieving user info: ' + error.message});
    }
};

controllers.getUsers = async (req, res) => {

    try {
        const query = `
            SELECT DISTINCT u.user_id, u.email, u.first_name, u.last_name,
                            ow.office_id, o.city
            FROM "hr"."users" u
            LEFT JOIN "centers"."office_workers" ow ON u.user_id = ow.user_id
            LEFT JOIN "centers"."offices" o ON ow.office_id = o.office_id
        `;

        const users = await db.sequelize.query(query, {
            type: db.Sequelize.QueryTypes.SELECT
        });

        res.status(200).json({ success: true, data: users });
    } catch (error) {
        res.status(500).json({success:false, message:'Error retrieving users: ' + error.message});
    }


};

controllers.updateUserOffice = async (req, res) => {
    const { user_id, office_id } = req.body;
    console.log(req.body)
    // if (!validator.isInt(user_id) || !validator.isInt(office_id)) {
    //     return res.status(400).json({ success: false, message: 'Invalid user ID or office ID' });
    // }
    try {
        const user = await db.Users.findByPk(user_id);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        const office = await db.Offices.findByPk(office_id);
        if (!office) {
            return res.status(404).json({ success: false, message: 'Office not found' });
        }

        const officeWorker = await db.OfficeWorkers.findOne({ where: { user_id } });
        if (officeWorker) {
            await officeWorker.destroy();
        }
        
        await db.OfficeWorkers.create({ user_id, office_id });

        res.status(200).json({ success: true, message: 'User office updated successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error updating user office: ' + error.message });
    }
};


controllers.getEventByDate = async (req, res) => {
    const { date } = req.params;
    if (!validator.isDate(date)) {
        return res.status(400).json({ success: false, message: 'Invalid date' });
    }
    try {
        const events = await db.Events.findAll({
            where: { event_date: date },
            order: [['creation_date', 'DESC']]
        });
        res.status(200).json({ success: true, data: events });
    } catch (error) {
        res.status(500).json({success:false, message:'Error retrieving events: ' + error.message});
    }
};

module.exports = controllers;

/*
controllers.getUserPreferences = async (req, res) => {
    const { user_id } = req.query;
    try {
        const userPreferences = await db.UserPref.findAll({ where: { user_id } });
        res.status(200).json(userPreferences);
    } catch (error) {
        res.status(500).send('Error retrieving user preferences: ' + error.message);
    }
};
*/