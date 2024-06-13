const Sequelize = require('sequelize');
const SequelizeDB = require('./db');

const User = require('./users');
const Language = require('./language');

const UserPref = SequelizeDB.define('UserPref', {
    USER_ID: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true
    },
    AREAS: {
        type: Sequelize.TEXT, 
        allowNull: true,
        get() {
            const value = this.getDataValue('AREAS');
            return value ? JSON.parse(value) : null;
        },
        set(value) {
            this.setDataValue('AREAS', JSON.stringify(value));
        }
    },
    SUB_AREAS: {
        type: Sequelize.TEXT,
        allowNull: true,
        get() {
            const value = this.getDataValue('SUB_AREAS');
            return value ? JSON.parse(value) : null;
        },
        set(value) {
            this.setDataValue('SUB_AREAS', JSON.stringify(value));
        }
    },
    ReceiveNotifications: {
        type: Sequelize.BOOLEAN,
        allowNull: false
    },
    LanguageID: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
            model: Language,
            key: 'LANGUAGE_ID'
        }
    },
    AdditionalPreferences: {
        type: Sequelize.TEXT,
        allowNull: true,
        get() {
            const value = this.getDataValue('AdditionalPreferences');
            return value ? JSON.parse(value) : null;
        },
        set(value) {
            this.setDataValue('AdditionalPreferences', JSON.stringify(value));
        }
    }
}, {
    tableName: 'USER_PREF',
    timestamps: false
});


UserPref.belongsTo(User, { foreignKey: 'USER_ID' });
UserPref.belongsTo(Language, { foreignKey: 'LanguageID' });

UserPref.sync();

module.exports = UserPref;

