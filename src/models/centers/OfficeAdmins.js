module.exports = (sequelize, DataTypes) => {
    const OfficeAdmins = sequelize.define('OfficeAdmins', {
        office_id: { type: DataTypes.INTEGER, primaryKey: true },
        manager_id: { type: DataTypes.INTEGER, primaryKey: true , allowNull: false }
    }, {
        schema: 'centers',
        tableName: 'office_admins',
        timestamps: false,
        indexes: [
            {
                unique: true,
                fields: ['office_id', 'manager_id']
            }
        ]
    });

    OfficeAdmins.associate = function(models) {
        OfficeAdmins.belongsTo(models.Offices, { foreignKey: 'office_id' });
        OfficeAdmins.belongsTo(models.Users, { foreignKey: 'manager_id' });
    };

    return OfficeAdmins;
};
