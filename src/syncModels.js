const db = require('./models');

async function createSchemas() {
    const schemas = [
        'admin',
        'centers',
        'communication',
        'control',
        'dynamic_content',
        'forms',
        'hr',
        'security',
        'static_content',
        'user_interactions'
    ];

    for (const schema of schemas) {
        await db.sequelize.query(`CREATE SCHEMA IF NOT EXISTS "${schema}"`);
        console.log(`Schema ${schema} ensured`);
    }
}

async function syncModels() {
    try {
        await db.sequelize.authenticate();
        console.log('Connection has been established successfully.');

        await createSchemas();

        const modelSyncOrder = [
            'ErrorLog',
            'AccPermissions',
            'Users',
            'UserActionsLog',
            'UserAccountDetails',
            'UserPasswordsDictionary',
            'UserPasswordsDictionaryHistory',
            'PasswdExpiringNotifications',
            'Offices',
            'OfficeAdmins',
            'OfficeWorkers',
            'Area',
            'SubArea',
            'Language',
            'AreaContent',
            'SubAreaContent',
            'UserPref',
            'Posts',
            'Events',
            'Forums',
            'Notifications',
            'EventForumAccess',
            'Bookmarks',
            'DefaultFields',
            'Fields',
            'Answers',
            'Participation',
            'Albuns',
            'Photographs',
            'Comments',
            'CommentPath',
            'Ratings',
            'Scores',
            'Reports',
            'Warnings',
            'ContentValidationStatus',
            'ActiveDiscussions',
        ];

        for (const modelName of modelSyncOrder) {
            if (db[modelName]) {
                console.log(`Syncing model: ${modelName}`);
                await db[modelName].sync({ alter: true });
                console.log(`Synced model: ${modelName}`);
            }
        }

        // Insert default roles into AccPermissions
        await db.sequelize.query(`
            INSERT INTO "security"."acc_permissions" (role_id, role_name, role_level) VALUES
            (1, 'User', 1),
            (2, 'CenterAdmin', 2),
            (3, 'ServerAdmin', 3)
            ON CONFLICT (role_id) DO NOTHING;
        `);

        // Insert default offices into Offices
        await db.sequelize.query(`
            INSERT INTO "centers"."offices" (office_id, city) VALUES
            (0, 'ALL'),
            (1, 'TOMAR'),
            (2, 'VISEU'),
            (3, 'FUNDAO'),
            (4, 'PORTALEGRE'),
            (5, 'VILA REAL')
            ON CONFLICT (office_id) DO NOTHING;
        `);

        // Manually add foreign key constraint after tables are created
        await db.sequelize.query(`
            ALTER TABLE "hr"."users"
            ALTER COLUMN "role_id" SET DEFAULT 1;
        `);
/*
        await db.sequelize.query(`
            CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
        `);
        */
        /*
        await db.sequelize.query(`
            ALTER TABLE "hr"."users"
            ADD CONSTRAINT "fk_users_role_id"
            FOREIGN KEY ("role_id")
            REFERENCES "security"."acc_permissions" ("role_id")
            ON DELETE NO ACTION
            ON UPDATE CASCADE;
        `);
        */

        console.log('All models were synchronized successfully.');
    } catch (error) {
        console.error('Unable to sync models:', error);
    } finally {
        await db.sequelize.close();
    }
}

syncModels();

//module.exports = syncModels;