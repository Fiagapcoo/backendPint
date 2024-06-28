module.exports = (sequelize, DataTypes) => {
    const UserPref = sequelize.define('UserPref', {
        user_id: { type: DataTypes.INTEGER, primaryKey: true },
        areas: { type: DataTypes.JSONB },
        sub_areas: { type: DataTypes.JSONB },
        receive_notifications: { type: DataTypes.BOOLEAN, allowNull: false },
        language_id: { type: DataTypes.INTEGER },
        additional_preferences: { type: DataTypes.JSONB }
    }, {
        schema: 'user_interactions',
        tableName: 'user_pref',
        timestamps: false
    });

    UserPref.associate = function(models) {
        UserPref.belongsTo(models.Users, { foreignKey: 'user_id' });
        UserPref.belongsTo(models.Language, { foreignKey: 'language_id' });
    };

    return UserPref;
};
