module.exports = (sequelize, DataTypes) => {
    const Participation = sequelize.define('Participation', {
        user_id: { type: DataTypes.INTEGER, primaryKey: true },
        event_id: { type: DataTypes.INTEGER, primaryKey: true },
        entry_date: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW }
    }, {
        schema: 'control',
        tableName: 'participation',
        timestamps: false
    });

    Participation.associate = function(models) {
        Participation.belongsTo(models.Users, { foreignKey: 'user_id' });
        Participation.belongsTo(models.Events, { foreignKey: 'event_id' });
    };

    return Participation;
};
