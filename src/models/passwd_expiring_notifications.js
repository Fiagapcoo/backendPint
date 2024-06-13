const Sequelize = require('sequelize');
const SequelizeDB = require('./db');
const User = require('./users');
const PasswdExpiringNotifications = SequelizeDB.define('PasswdExpiringNotifications', {
    NOTIFICATION_ID: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
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
    NOTIF_DATE: {
        type: Sequelize.DATE,
        allowNull: false
    },
    IS_NOTIFIED: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
    }
}, {
    tableName: 'PASSWD_EXPIRING_NOTIFICATIONS',
    timestamps: false
});

PasswdExpiringNotifications.sync();

PasswdExpiringNotifications.belongsTo(User, {
    foreignKey: 'USER_ID',
    onUpdate: 'CASCADE'
});

module.exports = PasswdExpiringNotifications;
