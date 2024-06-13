const Sequelize = require('sequelize');
const SequelizeDB = require('./db');

// Import related models
const Album = require('./album');
const User = require('./users');

const Photograph = SequelizeDB.define('Photograph', {
    PHOTO_ID: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    ALBUM_ID: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: Album,
            key: 'ALBUM_ID'
        }
    },
    PUBLISHER_ID: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'USER_ID'
        }
    },
    FILEPATH: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    UPLOAD_DATE: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
    }
}, {
    tableName: 'PHOTOGRAPHS',
    timestamps: false
});

// Define the associations
Photograph.belongsTo(Album, { foreignKey: 'ALBUM_ID' });
Photograph.belongsTo(User, { foreignKey: 'PUBLISHER_ID' });

Photograph.sync();

module.exports = Photograph;
