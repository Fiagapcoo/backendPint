const Sequelize = require('sequelize');
const SequelizeDB = require('./db');

// Import related models
const User = require('./users');
const Event = require('./events');

const Participation = SequelizeDB.define('Participation', {
    USER_ID: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        references: {
            model: User,
            key: 'USER_ID'
        }
    },
    EVENT_ID: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        references: {
            model: Event,
            key: 'EVENT_ID'
        }
    },
    ENTRY_DATE: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
    }
}, {
    tableName: 'PARTICIPATION',
    timestamps: false
});

// Define the associations
Participation.belongsTo(User, { foreignKey: 'USER_ID' });
Participation.belongsTo(Event, { foreignKey: 'EVENT_ID' });

Participation.sync();

module.exports = Participation;
