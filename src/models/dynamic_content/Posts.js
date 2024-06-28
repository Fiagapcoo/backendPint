module.exports = (sequelize, DataTypes) => {
    const Posts = sequelize.define('Posts', {
        post_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        sub_area_id: { type: DataTypes.INTEGER, allowNull: false },
        office_id: { type: DataTypes.INTEGER, allowNull: false },
        admin_id: { type: DataTypes.INTEGER },
        publisher_id: { type: DataTypes.INTEGER, allowNull: false },
        creation_date: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
        type: { type: DataTypes.CHAR(1), allowNull: false, defaultValue: 'N' },
        validated: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
        title: { type: DataTypes.STRING(255), allowNull: false },
        content: { type: DataTypes.TEXT, allowNull: false },
        p_location: { type: DataTypes.STRING(255) },
        filepath: { type: DataTypes.TEXT }
    }, {
        schema: 'dynamic_content',
        tableName: 'posts',
        timestamps: false
    });

    Posts.associate = function(models) {
        Posts.belongsTo(models.SubArea, { foreignKey: 'sub_area_id' });
        Posts.belongsTo(models.Users, { as: 'Publisher', foreignKey: 'publisher_id' });
        Posts.belongsTo(models.Users, { as: 'Admin', foreignKey: 'admin_id' });
        Posts.belongsTo(models.OfficeAdmins, { foreignKey: 'office_id' });
    };

    return Posts;
};
