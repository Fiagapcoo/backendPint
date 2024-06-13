var Sequelize = require('sequelize');
var SequelizeDB = require('./db');
var User = require('./users');

var UserActionsLog = SequelizeDB.define('UserActionsLog', {
    LOG_ID: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    USER_ID: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: User, // This should be the path to the User model
            key: 'USER_ID'
        },
    },
    ACTION_TYPE: {
        type: Sequelize.STRING(50),
        allowNull: false
    },
    ACTION_DESCRIPTION: {
        type: Sequelize.STRING(255),
        allowNull: false
    },
    ACTION_DATE: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
    }
}, {
    timestamps: false,
    tableName: 'USER_ACTIONS_LOG',
});

UserActionsLog.sync();

module.exports = UserActionsLog;
