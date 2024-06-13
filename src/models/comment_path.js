const Sequelize = require('sequelize');
const SequelizeDB = require('./db');

// Import related models
const Comment = require('./comment');

const CommentPath = SequelizeDB.define('CommentPath', {
    ANCESTOR_ID: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        references: {
            model: Comment,
            key: 'COMMENT_ID'
        }
    },
    DESCENDANT_ID: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        references: {
            model: Comment,
            key: 'COMMENT_ID'
        }
    },
    DEPTH: {
        type: Sequelize.INTEGER,
        allowNull: false
    }
}, {
    tableName: 'COMMENT_PATH',
    timestamps: false,
    validate: {
        noCycles() {
            if (this.ANCESTOR_ID === this.DESCENDANT_ID) {
                throw new Error('ANCESTOR_ID and DESCENDANT_ID cannot be the same');
            }
        }
    }
});

// Define the associations
CommentPath.belongsTo(Comment, { as: 'Ancestor', foreignKey: 'ANCESTOR_ID' });
CommentPath.belongsTo(Comment, { as: 'Descendant', foreignKey: 'DESCENDANT_ID' });

CommentPath.sync();

module.exports = CommentPath;
