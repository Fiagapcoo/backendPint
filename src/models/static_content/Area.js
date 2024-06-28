module.exports = (sequelize, DataTypes) => {
    const Area = sequelize.define('Area', {
        area_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        title: { type: DataTypes.STRING(255), allowNull: false, unique: true }
    }, {
        schema: 'static_content',
        tableName: 'area',
        timestamps: false
    });

    return Area;
};
