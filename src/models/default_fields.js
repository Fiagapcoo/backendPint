const Sequelize = require('sequelize');
const SequelizeDB = require('./db');

const DefaultField = SequelizeDB.define('DefaultField', {
    FIELD_ID: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
        initialAutoIncrement: 1000 // Start the auto increment from 1000
    },
    FIELD_NAME: {
        type: Sequelize.STRING(60),
        allowNull: false
    },
    FIELD_TYPE: {
        type: Sequelize.STRING(255),
        allowNull: false
    },
    FIELD_VALUE: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    MAX_VALUE: {
        type: Sequelize.INTEGER,
        allowNull: true
    },
    MIN_VALUE: {
        type: Sequelize.INTEGER,
        allowNull: true
    }
}, {
    tableName: 'DEFAULT_FIELDS',
    timestamps: false
});

DefaultField.sync();

module.exports = DefaultField;
