module.exports = (sequelize, DataTypes) => {
    const Fields = sequelize.define('Fields', {
        event_id: { type: DataTypes.INTEGER, allowNull: false },
        field_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        def_field_id: { type: DataTypes.INTEGER },
        field_name: { type: DataTypes.STRING(60), allowNull: false },
        field_type: { type: DataTypes.STRING(255), allowNull: false },
        field_value: { type: DataTypes.TEXT, allowNull: false },
        max_value: { type: DataTypes.INTEGER },
        min_value: { type: DataTypes.INTEGER }
    }, {
        schema: 'forms',
        tableName: 'fields',
        timestamps: false
    });

    Fields.associate = function(models) {
        Fields.belongsTo(models.Events, { foreignKey: 'event_id' });
        Fields.belongsTo(models.DefaultFields, { foreignKey: 'def_field_id' });
    };

    return Fields;
};
