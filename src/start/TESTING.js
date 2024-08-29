const db = require("../models");
const insertContentForTests = async () => {
  try {
    await db.sequelize.authenticate();

    await db.sequelize.query(`
      INSERT INTO "hr"."users" ("user_id","first_name", "last_name", "email", "join_date", "role_id")
      VALUES 
      (23,'Guilhermo', 'Pedrinho', 'guilopespedrinho@gmail.com', '2024-06-22', 3),
      (24,'Jose', 'Machado', 'josemachado74@gmail.com', '2024-06-22', 3)
      ON CONFLICT (email) DO NOTHING;
  `);

    /*
    await db.sequelize.query(`
      INSERT INTO "dynamic_content"."posts" ("sub_area_id", "office_id", "publisher_id", "title", "content", "type", "creation_date")
      VALUES
      (4002, 4, 18, 'le post for le test', 'cacacacacaca', 'P',CURRENT_TIMESTAMP),
      (4002, 4, 18, 'le post for le test2', 'cacacacacaca', 'P',CURRENT_TIMESTAMP),
      (4002, 4, 18, 'le post for le test3', 'cacacacacaca', 'P',CURRENT_TIMESTAMP);
  `);
    await db.sequelize.query(`
      INSERT INTO "dynamic_content"."events" ("publisher_id", "office_id", "sub_area_id", "name", "description", "event_location","event_date", "recurring","creation_date")
      VALUES
      (18, 2, 1001, 'VOLUNTARIADO SERA?', 'VOLUNTARIATE PARA SERES BOA PESSOA', '40.65056885039045 -7.905631258488603','2023-11-15', false,CURRENT_TIMESTAMP),
      (18, 2, 1001, 'VOLUNTARIADO SERA?', 'DOA SANGUE NAO SEJAS ESTRANHO', '40.65056885039045 -7.905631258488603','2023-11-15', false,CURRENT_TIMESTAMP);
      
  `);
    await db.sequelize.query(`
      INSERT INTO "dynamic_content"."forums" ("publisher_id", "office_id", "sub_area_id", "title", "content","creation_date")
      VALUES
      (18, 1, 4002, 'FORUM TEST', 'VIBES? WHAT ARE THOSE',CURRENT_TIMESTAMP),
      (18, 5, 1002, 'PRECISO DFE AJUDO A TESTAR', 'TESTES E MAIKS TESTES',CURRENT_TIMESTAMP);
  `);
  */
    console.log("All models were cleaned successfully.");
  } catch (error) {
    console.error("Unable to sync models:", error);
  } 
};

insertContentForTests();



const axios = require('axios');

async function loginAndGetTokens() {
    try {
        const response = await axios.post('localhost:8000/api/auth/mobile_login', {
            username: 'softshares-viseu@yopmail.com',
            password: '123456@Softshares'
        });

        const { accessToken, refreshToken } = response.data;
        return { accessToken, refreshToken };
    } catch (error) {
        console.error('Login failed:', error.response ? error.response.data : error.message);
        throw error;
    }
}

async function testRoute(accessToken, route) {
    try {
        const response = await axios.get(`localhost:8000/api/${route}`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });
        console.log(`Response from ${route}:`, response.data);
    } catch (error) {
        console.error(`Error testing route ${route}:`, error.response ? error.response.data : error.message);
    }
}

// async function refreshAccessToken(refreshToken) {
//     try {
//         const response = await axios.post('https://api.example.com/refresh-token', {
//             refreshToken
//         });
//         return response.data.accessToken;
//     } catch (error) {
//         console.error('Token refresh failed:', error.response ? error.response.data : error.message);
//         throw error;
//     }
// }

async function main() {
    try {
        let { accessToken, refreshToken } = await loginAndGetTokens();

        const routesToTest = ['route1', 'route2', 'route3'];

        for (let route of routesToTest) {
            await testRoute(accessToken, route);

            // Optional: Refresh the access token if needed
            // accessToken = await refreshAccessToken(refreshToken);
        }
    } catch (error) {
        console.error('Script failed:', error.message);
    }
}

main();

