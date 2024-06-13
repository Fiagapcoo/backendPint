var Sequelize = require('sequelize');
var SequelizeDB = require('./db');
var User = require('./users');

var UserAccountDetails = SequelizeDB.define('UserAccountDetails', {
    USER_ID: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        references: {
            model: User,
            key: 'USER_ID'
        }
    },
    ACCOUNT_STATUS: {  // 0 TO BE VALIDATED, 1 VALIDATED
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    ACCOUNT_RESTRICTION: { // 0 UNRESTRICTED, 1 RESTRICTED (AFTER A X n\BA of failed attempts)
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }
}, {
    timestamps: false,
    tableName: 'USER_ACCOUNT_DETAILS',
});

UserAccountDetails.sync();

UserAccountDetails.belongsTo(User, {
    foreignKey: 'USER_ID',
    onUpdate: 'CASCADE'
});

module.exports = UserAccountDetails;
