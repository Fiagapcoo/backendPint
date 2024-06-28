module.exports = (sequelize, DataTypes) => {
    const CommentPath = sequelize.define('CommentPath', {
        ancestor_id: { type: DataTypes.INTEGER, allowNull: false },
        descendant_id: { type: DataTypes.INTEGER, allowNull: false },
        depth: { type: DataTypes.INTEGER, allowNull: false }
    }, {
        schema: 'communication',
        tableName: 'comment_path',
        timestamps: false
    });

    CommentPath.associate = function(models) {
        CommentPath.belongsTo(models.Comments, { as: 'Ancestor', foreignKey: 'ancestor_id' });
        CommentPath.belongsTo(models.Comments, { as: 'Descendant', foreignKey: 'descendant_id' });
    };

    return CommentPath;
};
