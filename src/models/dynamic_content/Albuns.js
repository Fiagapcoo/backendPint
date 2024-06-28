module.exports = (sequelize, DataTypes) => {
    const Albuns = sequelize.define('Albuns', {
        album_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        event_id: { type: DataTypes.INTEGER, allowNull: false },
        sub_area_id: { type: DataTypes.INTEGER, allowNull: false },
        creation_date: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
        title: { type: DataTypes.STRING(255), allowNull: false }
    }, {
        schema: 'dynamic_content',
        tableName: 'albuns',
        timestamps: false
    });

    Albuns.associate = function(models) {
        Albuns.belongsTo(models.Events, { foreignKey: 'event_id' });
        Albuns.belongsTo(models.SubArea, { foreignKey: 'sub_area_id' });
    };

    return Albuns;
};
