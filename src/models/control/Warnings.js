module.exports = (sequelize, DataTypes) => {
    const Warnings = sequelize.define('Warnings', {
        warning_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        warning_level: { type: DataTypes.INTEGER, allowNull: false },
        description: { type: DataTypes.TEXT, allowNull: false },
        state: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
        creation_date: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
        admin_id: { type: DataTypes.INTEGER, allowNull: false },
        office_id: { type: DataTypes.INTEGER, allowNull: false }
    }, {
        schema: 'control',
        tableName: 'warnings',
        timestamps: false
    });

    Warnings.associate = function(models) {
        Warnings.belongsTo(models.Users, { foreignKey: 'admin_id' });
        Warnings.belongsTo(models.OfficeAdmins, { foreignKey: 'office_id' });
    };

    return Warnings;
};
