const Sequelize = require('sequelize');
const SequelizeDB = require('./db');

// Import related models
const User = require('./users');

const Bookmark = SequelizeDB.define('Bookmark', {
    BOOKMARK_ID: {
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
    CONTENT_ID: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    CONTENT_TYPE: {
        type: Sequelize.STRING(50),
        allowNull: false
    },
    BOOKMARK_DATE: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
    }
}, {
    tableName: 'BOOKMARKS',
    timestamps: false
});

// Define the associations
Bookmark.belongsTo(User, { foreignKey: 'USER_ID' });

Bookmark.sync();

module.exports = Bookmark;
