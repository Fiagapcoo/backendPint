module.exports = (sequelize, DataTypes) => {
    const Offices = sequelize.define('Offices', {
        office_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        city: { type: DataTypes.STRING(100), allowNull: false, unique: true }
    }, {
        schema: 'centers',
        tableName: 'offices',
        timestamps: false
    });

    return Offices;
};
