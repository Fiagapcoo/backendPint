module.exports = (sequelize, DataTypes) => {
    const Photographs = sequelize.define('Photographs', {
        photo_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        album_id: { type: DataTypes.INTEGER, allowNull: false },
        publisher_id: { type: DataTypes.INTEGER, allowNull: false },
        filepath: { type: DataTypes.TEXT, allowNull: false },
        upload_date: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW }
    }, {
        schema: 'dynamic_content',
        tableName: 'photographs',
        timestamps: false
    });

    Photographs.associate = function(models) {
        Photographs.belongsTo(models.Albuns, { foreignKey: 'album_id' });
        Photographs.belongsTo(models.Users, { foreignKey: 'publisher_id' });
    };

    return Photographs;
};
