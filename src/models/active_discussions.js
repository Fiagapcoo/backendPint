const Sequelize = require('sequelize');
const SequelizeDB = require('./db');

// Import related models
const Forum = require('./forums');

const ActiveDiscussion = SequelizeDB.define('ActiveDiscussion', {
    DISCUSSION_ID: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    FORUM_ID: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: Forum,
            key: 'FORUM_ID'
        }
    },
    LAST_ACTIVITY_DATE: {
        type: Sequelize.DATE,
        allowNull: true
    },
    ACTIVE_PARTICIPANTS: {
        type: Sequelize.INTEGER,
        allowNull: true
    }
}, {
    tableName: 'ACTIVE_DISCUSSIONS',
    timestamps: false
});

// Define the associations
ActiveDiscussion.belongsTo(Forum, { foreignKey: 'FORUM_ID' });

ActiveDiscussion.sync();

module.exports = ActiveDiscussion;
