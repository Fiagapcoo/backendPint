const Sequelize = require('sequelize');
const SequelizeDB = require('./db');
const OfficeAdmins = require('./office_admins'); 
const Users = require('./users');

const OfficeWorkers = SequelizeDB.define('OfficeWorkers', {
    OFFICE_ID: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        references: {
            model: OfficeAdmins,
            key: 'OFFICE_ID'
        }
    },
    USER_ID: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        references: {
            model: Users,
            key: 'USER_ID'
        }
    }
}, {
    tableName: 'OFFICE_WORKERS',
    timestamps: false
});

OfficeWorkers.sync();

// Define associations
OfficeWorkers.belongsTo(OfficeAdmins, {
    foreignKey: 'OFFICE_ID',
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE'
});

OfficeWorkers.belongsTo(Users, {
    foreignKey: 'USER_ID',
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE'
});

module.exports = OfficeWorkers;
