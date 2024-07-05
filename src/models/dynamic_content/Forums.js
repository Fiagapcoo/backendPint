module.exports = (sequelize, DataTypes) => {
    const Forums = sequelize.define('Forums', {
        forum_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        publisher_id: { type: DataTypes.INTEGER, allowNull: false },
        office_id: { type: DataTypes.INTEGER, allowNull: false },
        admin_id: { type: DataTypes.INTEGER },
        sub_area_id: { type: DataTypes.INTEGER },
        creation_date: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
        title: { type: DataTypes.STRING(255), allowNull: false },
        content: { type: DataTypes.TEXT, allowNull: false},
        event_id: { type: DataTypes.INTEGER },
        validated: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
        forum_status: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true }
    }, {
        schema: 'dynamic_content',
        tableName: 'forums',
        timestamps: false
    });

    Forums.associate = function(models) {
        Forums.belongsTo(models.OfficeAdmins, {as: 'Office_admin', foreignKey: 'office_id' });
        Forums.belongsTo(models.Offices, {as: 'Office', foreignKey: 'office_id' });
        Forums.belongsTo(models.SubArea, { foreignKey: 'sub_area_id' });
        Forums.belongsTo(models.Users, { as: 'Publisher', foreignKey: 'publisher_id' });
        Forums.belongsTo(models.Users, { as: 'Admin', foreignKey: 'admin_id' });
        Forums.belongsTo(models.Events, { foreignKey: 'event_id' });
    };

    return Forums;
};
