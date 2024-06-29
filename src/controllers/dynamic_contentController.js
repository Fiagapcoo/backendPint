const db = require('../models'); 

const controllers = {};

controllers.getAllContent = async (req, res) => {
    try {
        const posts = await db.Posts.findAll({ order: [['creation_date', 'DESC']] });
        const forums = await db.Forums.findAll({ order: [['creation_date', 'DESC']] });
        const events = await db.Events.findAll({ order: [['creation_date', 'DESC']] });
        res.status(200).json({ posts, forums, events });
    } catch (error) {
        res.status(500).send('Error retrieving content: ' + error.message);
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
        res.status(500).send('Error retrieving posts: ' + error.message);
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
        res.status(500).send('Error retrieving forums: ' + error.message);
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
        res.status(500).send('Error retrieving events: ' + error.message);
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
                { model: db.OfficeAdmins, as: 'Office' }
            ]
        });

        if (post) {
            res.status(200).json(post);
        } else {
            res.status(404).send('Post not found');
        }
    } catch (error) {
        res.status(500).send('Error retrieving post: ' + error.message);
    }
};


controllers.getEventById = async (req, res) => {
    const { event_id } = req.params;
    try {
        const event = await db.Events.findByPk(event_id, {
            include: [
                { model: db.Users, as: 'Publisher' },
                { model: db.OfficeAdmins, as: 'Office' },
                { model: db.Users, as: 'Admin' }
            ]
        });

        if (event) {
            res.status(200).json(event);
        } else {
            res.status(404).json({ message: 'Event not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving event', error: error.message });
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
            res.status(404).send('Forum not found');
        }
    } catch (error) {
        res.status(500).send('Error retrieving forum: ' + error.message);
    }
};

controllers.getUserInfo = async (req, res) => {
    const { user_id } = req.params;
    try {
        const user = await db.Users.findByPk(user_id , {
            attributes: { exclude: ['hashed_password', 'join_date', 'profile_pic'] }
        });
        res.status(200).json(user);
    } catch (error) {
        res.status(500).send('Error retrieving user info: ' + error.message);
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