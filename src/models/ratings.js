const Sequelize = require('sequelize');
const SequelizeDB = require('./db');

// Import related models
const Event = require('./events');
const Post = require('./posts');
const User = require('./users');

const Rating = SequelizeDB.define('Rating', {
    RATING_ID: {
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
    CRITIC_ID: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
            model: User,
            key: 'USER_ID'
        }
    },
    EVALUATION_DATE: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
    },
    EVALUATION: {
        type: Sequelize.INTEGER,
        allowNull: false
    }
}, {
    tableName: 'RATINGS',
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
Rating.belongsTo(Event, { foreignKey: 'EVENT_ID' });
Rating.belongsTo(Post, { foreignKey: 'POST_ID' });
Rating.belongsTo(User, { foreignKey: 'CRITIC_ID' });

Rating.sync();

module.exports = Rating;
