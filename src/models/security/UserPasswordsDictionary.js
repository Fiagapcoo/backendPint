const addMonths = (date, months) => {
    const d = new Date(date);
    d.setMonth(d.getMonth() + months);
    return d;
};

module.exports = (sequelize, DataTypes) => {
    const UserPasswordsDictionary = sequelize.define('UserPasswordsDictionary', {
        user_id: { type: DataTypes.INTEGER, primaryKey: true },
        hashed_passwd: { type: DataTypes.STRING(255), allowNull: false },
        salt: { type: DataTypes.STRING(255), allowNull: false },
        valid_from: { type: DataTypes.DATE, allowNull: true, defaultValue: new Date() },
        valid_to: { type: DataTypes.DATE, allowNull:true, defaultValue: addMonths(new Date(), 6)}
    }, {
        schema: 'security',
        tableName: 'user_passwords_dictionary',
        timestamps: false,
        // hooks: {
        //     beforeUpdate: async (userPassword, options) => {
        //         const historyModel = sequelize.models.UserPasswordsDictionaryHistory;
        //         await historyModel.create({
        //             user_id: userPassword.user_id,
        //             hashed_passwd: userPassword.hashed_passwd,
        //             salt: userPassword.salt,
        //             valid_from: userPassword.valid_from,
        //             valid_to: new Date()
        //         });
        //         userPassword.valid_from = new Date();
        //         userPassword.valid_to = addMonths(new Date(), 6);;
        //     },
        //     beforeDestroy: async (userPassword, options) => {
        //         const historyModel = sequelize.models.UserPasswordsDictionaryHistory;
        //         await historyModel.create({
        //             user_id: userPassword.user_id,
        //             hashed_passwd: userPassword.hashed_passwd,
        //             salt: userPassword.salt,
        //             valid_from: userPassword.valid_from,
        //             valid_to: new Date()
        //         });
        //     }
        // }
    });

    return UserPasswordsDictionary;
};
