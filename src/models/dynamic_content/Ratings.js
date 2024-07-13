module.exports = (sequelize, DataTypes) => {
    const Ratings = sequelize.define('Ratings', {
        rating_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        event_id: { type: DataTypes.INTEGER },
        post_id: { type: DataTypes.INTEGER },
        critic_id: { type: DataTypes.INTEGER },
        evaluation_date: { type: DataTypes.DATE, allowNull: false, defaultValue: sequelize.literal('CURRENT_TIMESTAMP') },
        evaluation: { type: DataTypes.INTEGER, allowNull: false }
    }, {
        schema: 'dynamic_content',
        tableName: 'ratings',
        timestamps: false
    });

    Ratings.associate = function(models) {
        Ratings.belongsTo(models.Posts, { foreignKey: 'post_id', targetKey: 'post_id', schema: 'dynamic_content' });
        Ratings.belongsTo(models.Events, { foreignKey: 'event_id', targetKey: 'event_id', schema: 'dynamic_content'});
        Ratings.belongsTo(models.Users, { foreignKey: 'critic_id', targetKey: 'user_id', schema: 'hr' });
    };

    return Ratings;
};
