const Sequelize = require('sequelize');
const SequelizeDB = require('./db');

const Area = SequelizeDB.define('Area', {
    AREA_ID: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: false
    },
    TITLE: {
        type: Sequelize.STRING(255), 
        allowNull: false,
        unique: true
    }
}, {
    tableName: 'AREA',
    timestamps: false,
    indexes: [
        {
            unique: true,
            fields: ['TITLE']
        }
    ],
    hooks: {
        beforeCreate: async (area, options) => {
            const maxArea = await Area.max('AREA_ID');
            area.AREA_ID = maxArea ? maxArea + 100 : 100;
        }
    }
});


Area.sync();

module.exports = Area;