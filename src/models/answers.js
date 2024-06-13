const Sequelize = require('sequelize');
const SequelizeDB = require('./db');

// Import related models
const User = require('./users');
const Field = require('./fields');

const Answer = SequelizeDB.define('Answer', {
    ID: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    USER_ID: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'USER_ID'
        }
    },
    EVENT_ID: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    FIELD_ID: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    ANSWER: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    ENTRY_DATE: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
    }
}, {
    tableName: 'ANSWERS',
    timestamps: false
});

// Define the composite foreign key association
Answer.belongsTo(Field, { foreignKey: 'EVENT_ID', targetKey: 'EVENT_ID' });
Answer.belongsTo(Field, { foreignKey: 'FIELD_ID', targetKey: 'FIELD_ID' });
Answer.belongsTo(User, { foreignKey: 'USER_ID' });

// Sync the model
Answer.sync();

module.exports = Answer;
