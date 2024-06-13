const Sequelize = require('sequelize');
const SequelizeDB = require('./db');

// Import related models
const Event = require('./events');
const Post = require('./posts');

const Score = SequelizeDB.define('Score', {
    AVG_RATING_ID: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    EVENT_ID: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
            model: Event,
            key: 'EVENT_ID'
        }
    },
    POST_ID: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
            model: Post,
            key: 'POST_ID'
        }
    },
    SCORE: {
        type: Sequelize.DECIMAL(2, 1),
        allowNull: false
    },
    NUM_OF_EVALS: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
    }
}, {
    tableName: 'SCORES',
    timestamps: false,
    validate: {
        eventOrPostNonnull() {
            if (this.EVENT_ID === null && this.POST_ID === null) {
                throw new Error('Either EVENT_ID or POST_ID must be provided');
            }
        }
    }
});

// Define the associations
Score.belongsTo(Event, { foreignKey: 'EVENT_ID' });
Score.belongsTo(Post, { foreignKey: 'POST_ID' });

Score.sync();

module.exports = Score;
