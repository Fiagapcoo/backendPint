var Sequelize = require('sequelize');
var SequelizeDB = require('./db');

var ErrorLog = SequelizeDB.define('ErrorLog', {
    ErrorLogID: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    ErrorMessage: {
        type: Sequelize.STRING(4000),
        allowNull: false
    },
    ErrorSeverity: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    ErrorState: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    ErrorTime: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
    }
}, {
    timestamps: false,
    tableName: 'ERROR_LOG',
});

ErrorLog.sync();


module.exports = ErrorLog;
