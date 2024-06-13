const Sequelize = require('sequelize');
const SequelizeDB = require('./db');

// Import related models
const User = require('./users');
const Event = require('./events');
const Post = require('./posts');

const Notification = SequelizeDB.define('Notification', {
    NOTIFICATION_ID: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    USER_ID: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'USER_ID'
        }
    },
    EVENT_ID: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
            model: Event,
            key: 'EVENT_ID'
        }
    },
    POST_ID: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
            model: Post,
            key: 'POST_ID'
        }
    },
    NOTIFICATION_TEXT: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    CREATE_DATE: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
    },
    IS_READ: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }
}, {
    tableName: 'NOTIFICATIONS',
    timestamps: false,
    hooks: {
        beforeCreate: (notification, options) => {
            if (!notification.EVENT_ID && !notification.POST_ID) {
                throw new Error('Either EVENT_ID or POST_ID must be provided');
            }
        }
    }
});

// Define the associations
Notification.belongsTo(User, { foreignKey: 'USER_ID' });
Notification.belongsTo(Event, { foreignKey: 'EVENT_ID' });
Notification.belongsTo(Post, { foreignKey: 'POST_ID' });

Notification.sync();

module.exports = Notification;
