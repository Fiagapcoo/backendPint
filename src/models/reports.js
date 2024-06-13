const Sequelize = require('sequelize');
const SequelizeDB = require('./db');

// Import related models
const User = require('./users');
const Comment = require('./comment');

const Report = SequelizeDB.define('Report', {
    REPORT_ID: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    REPORTER_ID: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'USER_ID'
        }
    },
    COMMENT_ID: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: Comment,
            key: 'COMMENT_ID'
        }
    },
    OBSERVATION: {
        type: Sequelize.STRING(255),
        allowNull: true
    },
    REPORT_DATE: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
    }
}, {
    tableName: 'REPORTS',
    timestamps: false
});

// Define the associations
Report.belongsTo(User, { foreignKey: 'REPORTER_ID' });
Report.belongsTo(Comment, { foreignKey: 'COMMENT_ID' });

Report.sync();

module.exports = Report;
