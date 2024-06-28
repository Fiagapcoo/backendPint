module.exports = (sequelize, DataTypes) => {
    const Reports = sequelize.define('Reports', {
        report_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        reporter_id: { type: DataTypes.INTEGER, allowNull: false },
        comment_id: { type: DataTypes.INTEGER, allowNull: false },
        observation: { type: DataTypes.STRING(255) },
        report_date: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW }
    }, {
        schema: 'control',
        tableName: 'reports',
        timestamps: false
    });

    Reports.associate = function(models) {
        Reports.belongsTo(models.Users, { foreignKey: 'reporter_id' });
        Reports.belongsTo(models.Comments, { foreignKey: 'comment_id' });
    };

    return Reports;
};
