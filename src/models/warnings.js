const Sequelize = require('sequelize');
const SequelizeDB = require('./db');

// Import related models
const User = require('./users');
const OfficeAdmin = require('./office_admins');

const Warning = SequelizeDB.define('Warning', {
    WARNING_ID: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    WARNING_LEVEL: {
        type: Sequelize.INTEGER,
        allowNull: false,
        validate: {
            min: 1,
            max: 5
        }
    },
    DESCRIPTION: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    STATE: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true
    },
    CREATION_DATE: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
    },
    ADMIN_ID: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'USER_ID'
        }
    },
    OFFICE_ID: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: OfficeAdmin,
            key: 'OFFICE_ID'
        }
    }
}, {
    tableName: 'WARNINGS',
    timestamps: false
});

// Define the associations
Warning.belongsTo(User, { foreignKey: 'ADMIN_ID' });
Warning.belongsTo(OfficeAdmin, { foreignKey: 'OFFICE_ID' });

Warning.sync();

module.exports = Warning;
