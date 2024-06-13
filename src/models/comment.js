const Sequelize = require('sequelize');
const SequelizeDB = require('./db');

// Import related models
const User = require('./users');
const Post = require('./posts');
const Forum = require('./forums');

const Comment = SequelizeDB.define('Comment', {
    COMMENT_ID: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    FORUM_ID: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
            model: Forum,
            key: 'FORUM_ID'
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
    PUBLISHER_ID: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'USER_ID'
        }
    },
    COMMENT_DATE: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
    },
    CONTENT: {
        type: Sequelize.TEXT,
        allowNull: false
    }
}, {
    tableName: 'COMMENTS',
    timestamps: false,
    validate: {
        forumOrPostNonnull() {
            if (this.FORUM_ID === null && this.POST_ID === null) {
                throw new Error('Either FORUM_ID or POST_ID must be provided');
            }
        }
    }
});

// Define the associations
Comment.belongsTo(User, { foreignKey: 'PUBLISHER_ID' });
Comment.belongsTo(Post, { foreignKey: 'POST_ID' });
Comment.belongsTo(Forum, { foreignKey: 'FORUM_ID' });

Comment.sync();

module.exports = Comment;
