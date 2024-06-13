const Sequelize = require('sequelize');
const SequelizeDB = require('./db');
const Offices = require('./offices'); // Adjust the path as necessary
const Users = require('./users'); // Assuming there's a Users model in HR schema

const OfficeAdmins = SequelizeDB.define('OfficeAdmins', {
    OFFICE_ID: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        references: {
            model: Offices,
            key: 'OFFICE_ID'
        }
    },
    MANAGER_ID: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: Users,
            key: 'USER_ID'
        }
    }
}, {
    tableName: 'OFFICE_ADMINS',
    timestamps: false
});

OfficeAdmins.sync();

// Define associations
OfficeAdmins.belongsTo(Offices, {
    foreignKey: 'OFFICE_ID',
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE'
});

OfficeAdmins.belongsTo(Users, {
    foreignKey: 'MANAGER_ID',
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE'
});

module.exports = OfficeAdmins;
