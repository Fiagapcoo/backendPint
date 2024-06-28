module.exports = (sequelize, DataTypes) => {
    const Comments = sequelize.define('Comments', {
        comment_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        forum_id: { type: DataTypes.INTEGER },
        post_id: { type: DataTypes.INTEGER },
        publisher_id: { type: DataTypes.INTEGER, allowNull: false },
        comment_date: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
        content: { type: DataTypes.TEXT, allowNull: false }
    }, {
        schema: 'communication',
        tableName: 'comments',
        timestamps: false
    });

    Comments.associate = function(models) {
        Comments.belongsTo(models.Users, { foreignKey: 'publisher_id' });
        Comments.belongsTo(models.Posts, { foreignKey: 'post_id' });
        Comments.belongsTo(models.Forums, { foreignKey: 'forum_id' });
    };

    return Comments;
};
