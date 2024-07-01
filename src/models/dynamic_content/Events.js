module.exports = (sequelize, DataTypes) => {
    const Events = sequelize.define('Events', {
        event_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        publisher_id: { type: DataTypes.INTEGER, allowNull: false },
        office_id: { type: DataTypes.INTEGER, allowNull: false },
        sub_area_id: { type: DataTypes.INTEGER, allowNull: false },
        admin_id: { type: DataTypes.INTEGER },
        creation_date: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
        name: { type: DataTypes.STRING(255), allowNull: false },
        description: { type: DataTypes.TEXT, allowNull: false },
        event_date: { type: DataTypes.DATE, allowNull: false },
        event_location: { type: DataTypes.STRING(255) },
        filepath: { type: DataTypes.TEXT },
        recurring: { type: DataTypes.BOOLEAN, allowNull: false },
        recurring_pattern: { type: DataTypes.JSONB },
        max_participants: { type: DataTypes.INTEGER },
        current_participants: { type: DataTypes.INTEGER, defaultValue: 1 },
        validated: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false }
    }, {
        schema: 'dynamic_content',
        tableName: 'events',
        timestamps: false
    });

    Events.associate = function(models) {
        Events.belongsTo(models.OfficeAdmins, {as: 'Office', foreignKey: 'office_id' });
        Events.belongsTo(models.Users, { as: 'Publisher', foreignKey: 'publisher_id' });
        Events.belongsTo(models.Users, { as: 'Admin', foreignKey: 'admin_id' });
        Events.hasOne(models.Scores, { as: 'Score', foreignKey: 'event_id' });

    };

    return Events;
};
