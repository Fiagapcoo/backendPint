const Sequelize = require('sequelize');
const SequelizeDB = require('./db');

const User = require('./users');
const OfficeAdmin = require('./office_admins');
const SubArea = require('./sub_area');

const Event = SequelizeDB.define('Event', {
    EVENT_ID: {
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
    SUBAREA_ID: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: SubArea,
            key: 'SUB_AREA_ID'
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
    CREATION_DATE: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
    },
    NAME: {
        type: Sequelize.STRING(255),
        allowNull: false
    },
    DESCRIPTION: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    EVENT_DATE: {
        type: Sequelize.DATE,
        allowNull: false
    },
    EVENT_LOCATION: {
        type: Sequelize.STRING(255),
        allowNull: true
    },
    FILEPATH: {
        type: Sequelize.TEXT,
        allowNull: true
    },
    RECURRING: {
        type: Sequelize.BOOLEAN,
        allowNull: false
    },
    RECURRING_PATTERN: {
        type: Sequelize.TEXT,
        allowNull: true,
        get() {
            const value = this.getDataValue('RECURRING_PATTERN');
            return value ? JSON.parse(value) : null;
        },
        set(value) {
            this.setDataValue('RECURRING_PATTERN', JSON.stringify(value));
        }
    },
    MAX_PARTICIPANTS: {
        type: Sequelize.INTEGER,
        allowNull: true
    },
    CURRENT_PARTICIPANTS: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: 1
    },
    VALIDATED: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }
}, {
    tableName: 'EVENTS',
    timestamps: false
});

// Define the associations
Event.belongsTo(User, { as: 'Publisher', foreignKey: 'PUBLISHER_ID' });
Event.belongsTo(User, { as: 'Admin', foreignKey: 'ADMIN_ID' });
Event.belongsTo(OfficeAdmin, { as: 'OfficeAdmin', foreignKey: 'OFFICE_ID' });
Event.belongsTo(SubArea, { as: 'SubArea', foreignKey: 'SUBAREA_ID' });

Event.sync();

module.exports = Event;
