const Sequelize = require('sequelize');
const SequelizeDB = require('./db');

const Language = require('./language');

const AreaContent = SequelizeDB.define('AreaContent', {
    AREA_ID: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true
    },
    LANGUAGE_ID: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true
    },
    TRANSLATED_TITLE: {
        type: Sequelize.STRING(255),
        allowNull: false,
        unique: true
    }
}, {
    tableName: 'AREA_CONTENT',
    timestamps: false,
    indexes: [
        {
            unique: true,
            fields: ['AREA_ID', 'LANGUAGE_ID']
        },
        {
            unique: true,
            fields: ['TRANSLATED_TITLE']
        }
    ]
});

AreaContent.belongsTo(Language, { foreignKey: 'LANGUAGE_ID' });

AreaContent.sync();

module.exports = AreaContent;
