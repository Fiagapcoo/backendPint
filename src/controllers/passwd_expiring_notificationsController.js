const passwd_expiring_notificationsModel = require('../models/passwd_expiring_notifications');
const userController = require('../models/users');

const passwd_expiring_notificationsController = {};

passwd_expiring_notificationsController.list = async (req, res) => {
    try {
        const passwd_expiring_notifications = await passwd_expiring_notificationsModel.findAll(
            {
                include: {
                    model: userController,
                    required: true
                }
            }

        );
        res.json(passwd_expiring_notifications);
    } catch (error) {
        res.status(400).send('Error retrieving passwd_expiring_notifications');
    }
}

passwd_expiring_notificationsController.get = async (req, res) => {
    try {
        const { id } = req.params;
        const passwd_expiring_notifications = await passwd_expiring_notificationsModel.findByPk(id
            ,{
                include: {
                    model: userController,
                    required: true
                }
            }
        );
        if (passwd_expiring_notifications) {
            res.json(passwd_expiring_notifications);
        } else {
            res.status(404).send('passwd_expiring_notifications not found');
        }
    } catch (error) {
        res.status(400).send('Error retrieving passwd_expiring_notifications');
    }
}


passwd_expiring_notificationsController.update = async (req, res) => {
    try {
        const { id } = req.params;
        const [updated] = await passwd_expiring_notifications.update(req.body, {
            where: { id: id }
        });
        if (updated) {
            const updatedpasswd_expiring_notifications = await passwd_expiring_notificationsModel.findByPk(id);
            res.json(updatedpasswd_expiring_notifications);
        } else {
            res.status(404).send('passwd_expiring_notifications not found');
        }
    } catch (error) {
        res.status(400).send('Error updating passwd_expiring_notifications');
    }
}

passwd_expiring_notificationsController.create = async (req, res) => {
 
    try{
        const {USER_ID, NOTIF_DATE, IS_NOTIFIED} = req.body;

        const passwd_expiring_notifications = await passwd_expiring_notificationsModel.create({
            USER_ID,
            NOTIF_DATE,
            IS_NOTIFIED
        });

        res.status(201).json({ message: 'New passwd_expiring_notifications created', passwd_expiring_notifications });
    }catch(error){
        console.log(error);
        res.status(400).json({ message: error.message });
    }
}

module.exports = passwd_expiring_notificationsController;