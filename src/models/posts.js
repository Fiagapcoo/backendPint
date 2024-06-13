const Sequelize = require('sequelize');
const SequelizeDB = require('./db');

const SubArea = require('./sub_area');
const User = require('./users');
const Office = require('./office_admins');

const Post = SequelizeDB.define('Post', {
    POST_ID: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    SUB_AREA_ID: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: SubArea,
            key: 'SUB_AREA_ID'
        }
    },
    OFFICE_ID: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: Office,
            key: 'OFFICE_ID'
        }
    },
    ADMIN_ID: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
            model: User,
            key: 'USER_ID'
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
    CREATION_DATE: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
    },
    TYPE: {
        type: Sequelize.CHAR(1),
        allowNull: false,
        defaultValue: 'N',
        validate: {
            isIn: [['N', 'P']]
        }
    },
    VALIDATED: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    TITLE: {
        type: Sequelize.STRING(255),
        allowNull: false
    },
    CONTENT: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    P_LOCATION: {
        type: Sequelize.STRING(255),
        allowNull: true
    },
    FILEPATH: {
        type: Sequelize.TEXT,
        allowNull: true
    }
}, {
    tableName: 'POSTS',
    timestamps: false
});

// Define the associations
Post.belongsTo(SubArea, { foreignKey: 'SUB_AREA_ID' });
Post.belongsTo(User, { as: 'Publisher', foreignKey: 'PUBLISHER_ID' });
Post.belongsTo(User, { as: 'Admin', foreignKey: 'ADMIN_ID' });
Post.belongsTo(Office, { foreignKey: 'OFFICE_ID' });

// Sync the model
Post.sync();

module.exports = Post;
