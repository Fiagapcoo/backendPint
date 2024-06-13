const Sequelize = require('sequelize');
const SequelizeDB = require('./db');
const Acc_permissions = require('./acc_permissions');

const User = SequelizeDB.define('User', {
    USER_ID: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    EMPLOYEE_ID: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        unique: true
    },
    firstNAME: {
        type: Sequelize.STRING(30),
        allowNull: false
    },
    lastNAME: {
        type: Sequelize.STRING(30),
        allowNull: false
    },
    EMAIL: {
        type: Sequelize.STRING(100),
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true
        }
    },
    HASHED_PASSWORD: {
        type: Sequelize.STRING(255),
        allowNull: true 
    },
    PROFILE_PIC: {
        type: Sequelize.STRING(300),
        allowNull: true
    },
    RoleID: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1,
        references: {
            model: Acc_permissions,
            key: 'RoleID'
        },
    },
    JOIN_DATE: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
    },
    LAST_ACCESS: {
        type: Sequelize.DATE,
        allowNull: true,
        defaultValue: null
    }
}, {
    tableName: 'USERS',
    timestamps: false
});


User.sync();

User.belongsTo(Acc_permissions, {
    foreignKey: 'RoleID',
    onUpdate: 'CASCADE'
});

module.exports = User;

