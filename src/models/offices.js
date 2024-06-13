const Sequelize = require('sequelize');
const SequelizeDB = require('./db');

const Offices = SequelizeDB.define('Offices', {
    OFFICE_ID: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    CITY: {
        type: Sequelize.STRING(100),
        allowNull: false,
        unique: true
    }
}, {
    tableName: 'OFFICES',
    timestamps: false,
    indexes: [
        {
            unique: true,
            fields: ['CITY']
        }
    ]
});

Offices.sync({ force: false })

module.exports = Offices;
