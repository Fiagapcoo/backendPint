const Sequelize = require('sequelize');
const SequelizeDB = require('./db');

// Import related models
const User = require('./users');
const OfficeAdmin = require('./office_admins');
const SubArea = require('./sub_area');
const Event = require('./events');

const Forum = SequelizeDB.define('Forum', {
    FORUM_ID: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    PUBLISHER_ID: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'USER_ID'
        }
    },
    OFFICE_ID: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: OfficeAdmin,
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
    SUB_AREA_ID: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
            model: SubArea,
            key: 'SUB_AREA_ID'
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
    },
    CONTENT: {
        type: Sequelize.TEXT,
        allowNull: true
    },
    EVENT_ID: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
            model: Event,
            key: 'EVENT_ID'
        }
    },
    VALIDATED: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    FORUM_STATUS: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true
    }
}, {
    tableName: 'FORUMS',
    timestamps: false
});

// Define the associations
Forum.belongsTo(User, { as: 'Publisher', foreignKey: 'PUBLISHER_ID' });
Forum.belongsTo(User, { as: 'Admin', foreignKey: 'ADMIN_ID' });
Forum.belongsTo(OfficeAdmin, { as: 'OfficeAdmin', foreignKey: 'OFFICE_ID' });
Forum.belongsTo(SubArea, { as: 'SubArea', foreignKey: 'SUB_AREA_ID' });
Forum.belongsTo(Event, { as: 'Event', foreignKey: 'EVENT_ID' });

Forum.sync();

module.exports = Forum;
