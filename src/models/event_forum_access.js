const Sequelize = require('sequelize');
const SequelizeDB = require('./db');

// Import related models
const User = require('./users');
const Forum = require('./forums');

const EventForumAccess = SequelizeDB.define('EventForumAccess', {
    USER_ID: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        references: {
            model: User,
            key: 'USER_ID'
        }
    },
    FORUM_ID: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        references: {
            model: Forum,
            key: 'FORUM_ID'
        }
    }
}, {
    tableName: 'EVENT_FORUM_ACCESS',
    timestamps: false
});

// Define the associations
EventForumAccess.belongsTo(User, { foreignKey: 'USER_ID' });
EventForumAccess.belongsTo(Forum, { foreignKey: 'FORUM_ID' });

EventForumAccess.sync();

module.exports = EventForumAccess;
