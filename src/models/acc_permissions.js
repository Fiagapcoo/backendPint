var Sequelize = require('sequelize');
var SequelizeDB = require('./db');

const AccPermissions = SequelizeDB.define('AccPermissions', {
    RoleID: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    RoleName: {
        type: Sequelize.STRING(50),
        allowNull: true
    },
    RoleLevel: {
        type: Sequelize.INTEGER,
        allowNull: true
    }
}, {
    timestamps: false,
    tableName: 'ACC_PERMISSIONS',
});

AccPermissions.sync();

module.exports = AccPermissions;