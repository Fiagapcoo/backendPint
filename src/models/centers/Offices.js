
module.exports = (sequelize, DataTypes) => {
    const Offices = sequelize.define('Offices', {
        office_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        city: { type: DataTypes.STRING(100), allowNull: false, unique: true },
        officeImage: { type: DataTypes.STRING(255), allowNull: true },
    }, {
        schema: 'centers',
        tableName: 'offices',
        timestamps: false
    });

    Offices.associate = function(models) {
        Offices.belongsTo(models.OfficeAdmins, { foreignKey: 'office_id' });
        Offices.belongsTo(models.OfficeWorkers, { foreignKey: 'office_id' });
        
    };

    return Offices;
};
