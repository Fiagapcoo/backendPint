module.exports = (sequelize, DataTypes) => {
    const Bookmarks = sequelize.define('Bookmarks', {
        bookmark_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        user_id: { type: DataTypes.INTEGER, allowNull: false },
        content_id: { type: DataTypes.INTEGER, allowNull: false },
        content_type: { type: DataTypes.STRING(50) },
        bookmark_date: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW }
    }, {
        schema: 'user_interactions',
        tableName: 'bookmarks',
        timestamps: false
    });

    Bookmarks.associate = function(models) {
        Bookmarks.belongsTo(models.Users, { foreignKey: 'user_id' });
    };

    return Bookmarks;
};
