const Sequelize = require('sequelize');
const SequelizeDB = require('./db');
const Language = require('./language');

const SubAreaContent = SequelizeDB.define('SubAreaContent', {
    SUB_AREA_ID: {
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
    tableName: 'SUB_AREA_CONTENT',
    timestamps: false,
    indexes: [
        {
            unique: true,
            fields: ['SUB_AREA_ID']
        },
        {
            unique: true,
            fields: ['LANGUAGE_ID']
        },
        {
            unique: true,
            fields: ['TRANSLATED_TITLE']
        }
    ]
});


SubAreaContent.belongsTo(Language, { foreignKey: 'LANGUAGE_ID' });

SubAreaContent.sync({force: false});

module.exports = SubAreaContent;
