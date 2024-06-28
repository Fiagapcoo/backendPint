module.exports = (sequelize, DataTypes) => {
    const OfficeWorkers = sequelize.define('OfficeWorkers', {
        office_id: { type: DataTypes.INTEGER, primaryKey: true },
        user_id: { type: DataTypes.INTEGER, primaryKey: true }
    }, {
        schema: 'centers',
        tableName: 'office_workers',
        timestamps: false,
        indexes: [
            {
                unique: true,
                fields: ['office_id', 'user_id']
            }
        ]
    });

    OfficeWorkers.associate = function(models) {
        OfficeWorkers.belongsTo(models.OfficeAdmins, { foreignKey: 'office_id' });
        OfficeWorkers.belongsTo(models.Users, { foreignKey: 'user_id' });
    };

    return OfficeWorkers;
};
