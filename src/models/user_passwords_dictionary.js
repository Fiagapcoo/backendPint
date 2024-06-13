const Sequelize = require('sequelize');
const SequelizeDB = require('./db');
const User = require('./users'); 

const UserPasswordsDictionary = SequelizeDB.define('UserPasswordsDictionary', {
    USER_ID: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        references: {
            model: User,
            key: 'USER_ID'
        }
    },
    HASHED_PASSWD: {
        type: Sequelize.STRING(255),
        allowNull: false
    },
    SALT: {
        type: Sequelize.STRING(255),
        allowNull: false
    },
    ValidFrom: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        get() {
            return this.getDataValue('ValidFrom').toISOString();
        }
    },
    ValidTo: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal(`CURRENT_TIMESTAMP + INTERVAL '6 months'`),
        get() {
            return this.getDataValue('ValidTo').toISOString();
        }
    }
}, {
    timestamps: false,
    tableName: 'USER_PASSWORDS_DICTIONARY',
    version: true,
});

UserPasswordsDictionary.sync();

UserPasswordsDictionary.belongsTo(User, {
    foreignKey: 'USER_ID',
    onUpdate: 'CASCADE'
});

module.exports = UserPasswordsDictionary;
