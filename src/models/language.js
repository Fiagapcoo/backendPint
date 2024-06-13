const Sequelize = require('sequelize');
const SequelizeDB = require('./db');

const Language = SequelizeDB.define('Language', {
    LANGUAGE_ID: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    LANGUAGE_CODE: {
        type: Sequelize.CHAR(2),
        allowNull: false,
        unique: true
    },
    LANGUAGE_NAME: {
        type: Sequelize.STRING(30),
        allowNull: false
    },
    FLAG_IMAGE: {
        type: Sequelize.STRING(255),
        allowNull: true
    }
}, {
    tableName: 'LANGUAGE',
    timestamps: false,
    indexes: [
        {
            unique: true,
            fields: ['LANGUAGE_CODE']
        }
    ]
});

Language.sync();

module.exports = Language;
