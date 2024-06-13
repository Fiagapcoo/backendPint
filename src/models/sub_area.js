
const Sequelize = require('sequelize');
const SequelizeDB = require('./db');
const Area = require('./area'); // Adjust the path as necessary

const SubArea = SequelizeDB.define('SubArea', {
    SUB_AREA_ID: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: false // We will handle auto-increment manually
    },
    AREA_ID: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: Area,
            key: 'AREA_ID'
        }
    },
    TITLE: {
        type: Sequelize.STRING(255), 
        allowNull: false,
        unique: true
    }
}, {
    tableName: 'SUB_AREA',
    timestamps: false,
    indexes: [
        {
            unique: true,
            fields: ['TITLE']
        }
    ],
    hooks: {
        beforeCreate: async (subArea, options) => {
            const maxSubArea = await SubArea.max('SUB_AREA_ID');
            subArea.SUB_AREA_ID = maxSubArea ? maxSubArea + 1 : 1001;
        }
    }
});

SubArea.sync();

// Define association
SubArea.belongsTo(Area, {
    foreignKey: 'AREA_ID',
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE'
});

module.exports = SubArea;
