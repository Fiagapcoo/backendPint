const Sequelize = require('sequelize');
const SequelizeDB = require('./db');

// Import related models
const User = require('./users');

const ContentValidationStatus = SequelizeDB.define('ContentValidationStatus', {
    CONTENT_ID: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    CONTENT_TYPE: {
        type: Sequelize.STRING(50),
        allowNull: false
    },
    CONTENT_STATUS: {
        type: Sequelize.STRING(50),
        allowNull: false,
        defaultValue: 'Pending'
    },
    VALIDATION_DATE: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
    },
    CONTENT_REAL_ID: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    VALIDATOR_ID: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
            model: User,
            key: 'USER_ID'
        }
    }
}, {
    tableName: 'CONTENT_VALIDATION_STATUS',
    timestamps: false
});

// Define the associations
ContentValidationStatus.belongsTo(User, { foreignKey: 'VALIDATOR_ID' });

ContentValidationStatus.sync();

module.exports = ContentValidationStatus;
