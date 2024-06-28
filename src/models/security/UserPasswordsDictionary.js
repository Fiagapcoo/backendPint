module.exports = (sequelize, DataTypes) => {
    const UserPasswordsDictionary = sequelize.define('UserPasswordsDictionary', {
        user_id: { type: DataTypes.INTEGER, primaryKey: true },
        hashed_passwd: { type: DataTypes.STRING(255), allowNull: false },
        //salt: { type: DataTypes.STRING(255), allowNull: false },
        valid_from: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
        valid_to: { type: DataTypes.DATE, defaultValue: '9999-12-31 23:59:59' }
    }, {
        schema: 'security',
        tableName: 'user_passwords_dictionary',
        timestamps: false,
        hooks: {
            beforeUpdate: async (userPassword, options) => {
                const historyModel = sequelize.models.UserPasswordsDictionaryHistory;
                await historyModel.create({
                    user_id: userPassword.user_id,
                    hashed_passwd: userPassword.hashed_passwd,
                    //salt: userPassword.salt,
                    valid_from: userPassword.valid_from,
                    valid_to: new Date()
                });
                userPassword.valid_from = new Date();
                userPassword.valid_to = '9999-12-31 23:59:59';
            },
            beforeDestroy: async (userPassword, options) => {
                const historyModel = sequelize.models.UserPasswordsDictionaryHistory;
                await historyModel.create({
                    user_id: userPassword.user_id,
                    hashed_passwd: userPassword.hashed_passwd,
                    //salt: userPassword.salt,
                    valid_from: userPassword.valid_from,
                    valid_to: new Date()
                });
            }
        }
    });

    return UserPasswordsDictionary;
};
