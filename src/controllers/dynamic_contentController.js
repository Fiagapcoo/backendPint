const db = require('../models'); 

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
    const { city } = req.params;
    try {
        const posts = await db.Posts.findAll({
            include: [{
                model: db.Offices,
                where: { city }
            }],
            order: [['creation_date', 'DESC']]
        });
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({success:false, message:'Error retrieving posts: ' + error.message});
    }
};

controllers.getForumsByCity = async (req, res) => {
    const { city } = req.params;
    try {
        const forums = await db.Forums.findAll({
            include: [{
                model: db.Offices,
                where: { city }
            }],
            order: [['creation_date', 'DESC']]
        });
        res.status(200).json(forums);
    } catch (error) {
        res.status(500).json({success:false, message:'Error retrieving forums: ' + error.message});
    }
};

controllers.getEventsByCity = async (req, res) => {
    const { city } = req.params;
    try {
        const events = await db.Events.findAll({
            include: [{
                model: db.Offices,
                where: { city }
            }],
            order: [['creation_date', 'DESC']]
        });
        res.status(200).json(events);
    } catch (error) {
        res.status(500).json({success:false, message:'Error retrieving events: ' + error.message});
    }
};

controllers.getPostById = async (req, res) => {
    const { post_id } = req.params;
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


controllers.getEventById = async (req, res) => {
    const { event_id } = req.params;
    const userId = req.user.id; // Extracted from JWT 
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
            WHERE "user_id" = :userId AND "event_id" = :eventId`,
            { replacements: { userId, eventId: event_id }, type: QueryTypes.SELECT }
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
    try {
        const user = await db.Users.findByPk(user_id , {
            attributes: { exclude: ['hashed_password', 'join_date', 'profile_pic'] },
            include: [
                {
                    model: db.OfficeWorkers,
                    as: 'OfficeWorkers',
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