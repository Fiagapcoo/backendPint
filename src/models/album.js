const Sequelize = require('sequelize');
const SequelizeDB = require('./db');

// Import related models
const Event = require('./events');
const Area = require('./area');

const Album = SequelizeDB.define('Album', {
    ALBUM_ID: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    EVENT_ID: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: Event,
            key: 'EVENT_ID'
        }
    },
    AREA_ID: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: Area,
            key: 'AREA_ID'
        }
    },
    CREATION_DATE: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
    },
    TITLE: {
        type: Sequelize.STRING(255),
        allowNull: false
    }
}, {
    tableName: 'ALBUNS',
    timestamps: false
});

// Define the associations
Album.belongsTo(Event, { foreignKey: 'EVENT_ID' });
Album.belongsTo(Area, { foreignKey: 'AREA_ID' });

Album.sync();

module.exports = Album;
