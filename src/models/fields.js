const Sequelize = require('sequelize');
const SequelizeDB = require('./db');

// Import related models
const Event = require('./events');
const DefaultField = require('./default_fields');

const Field = SequelizeDB.define('Field', {
    EVENT_ID: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        references: {
            model: Event,
            key: 'EVENT_ID'
        }
    },
    FIELD_ID: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    DEF_FIELD_ID: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
            model: DefaultField,
            key: 'FIELD_ID'
        }
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
    tableName: 'FIELDS',
    timestamps: false
});

// Define the associations
Field.belongsTo(Event, { foreignKey: 'EVENT_ID' });
Field.belongsTo(DefaultField, { foreignKey: 'DEF_FIELD_ID' });

Field.sync();

module.exports = Field;
