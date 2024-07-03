const { QueryTypes } = require('sequelize');
const { logError} = require('./generalHelpers');
const { logUserAction} = require('./usersProcedures');
const { sendMail } = require('../../controllers/emailController');

const db = require('../../models'); 


const spAssignUserToCenter = async (userId, centerId, transaction) => {
    //const transaction = await db.sequelize.transaction();
    try {
      const exists = await db.sequelize.query(
        `SELECT 1 FROM "centers"."office_workers" WHERE "user_id" = :userId AND "office_id" = :centerId`,
        {
          replacements: { userId, centerId },
          type: QueryTypes.SELECT,
          transaction
        }
      );
  
      if (!exists.length) {
        await db.sequelize.query(
          `INSERT INTO "centers"."office_workers" ("user_id", "office_id")
           VALUES (:userId, :centerId)`,
          {
            replacements: { userId, centerId },
            type: QueryTypes.INSERT,
            transaction
          }
        );
      } else {
        throw new Error('User is already assigned to this center.');
      }
  
      //await transaction.commit();
    } catch (error) {
      //await transaction.rollback();
      throw error;
    }
};

const spSendWelcomeEmail = async (email) => {
    try {
      sendMail({
        to: email,
        subject: 'Welcome to the Company!',
        body: '<br><br>Welcome to the company! We are excited to have you on board in SoftShares.<br><br>Best Regards,<br>Softinsa'
      });
    } catch (error) {
      throw error;
    }
};

const spRegisterNewUser = async (firstName, lastName, email, centerId, profilePic = null) => {
    const transaction = await db.sequelize.transaction();
    try {
      const [result] = await db.sequelize.query(
        `INSERT INTO "hr"."users" ("first_name", "last_name", "email", "profile_pic", "join_date")
         VALUES (:firstName, :lastName, :email, :profilePic, NOW())
         RETURNING "user_id"`,
        {
          replacements: { firstName, lastName, email, profilePic },
          type: QueryTypes.INSERT,
          transaction
        }
      );
      
      const res = await db.sequelize.query(
        `SELECT "user_id" FROM "hr"."users" WHERE "email" = :email`,
        {
          replacements: { email },
          type: QueryTypes.SELECT,
          transaction
        }
      )
      console.log(res); 
      const userId = result[0].user_id;
  
      await db.sequelize.query(
        `INSERT INTO "security"."user_account_details" ("user_id")
         VALUES (:userId)`,
        {
          replacements: { userId },
          type: QueryTypes.INSERT,
          transaction
        }
      );
  
      await spAssignUserToCenter(userId, centerId, transaction);
  
      // await sendMail({
      //   to: email,
      //   subject: 'SOFTSHARES - Account Creation',
      //   body: 'This email serves as a notification for successful account creation. Pay attention as you will soon receive an email with a link to create your password!'
      // });
  
      //await spSendWelcomeEmail(email);
  
      await transaction.commit();
      return res;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
};


const spCreateUserPassword = async (email, password) => {
    const transaction = await db.sequelize.transaction();
    try {
      const [user] = await db.sequelize.query(
        `SELECT "user_id" FROM "hr"."users" WHERE "email" = :email`,
        {
          replacements: { email },
          type: QueryTypes.SELECT,
          transaction
        }
      );
  
      if (!user) {
        throw new Error('User not found');
      }
  
      const userId = user.user_id;
      const salt = generateSalt();
      const hashedPassword = hashPassword(password, salt);
  
      await db.sequelize.query(
        `UPDATE "hr"."users" SET "hashed_password" = :hashedPassword WHERE "user_id" = :userId`,
        {
          replacements: { hashedPassword, userId },
          type: QueryTypes.UPDATE,
          transaction
        }
      );
  
      await db.sequelize.query(
        `INSERT INTO "security"."user_passwords_dictionary" ("user_id", "hashed_password", "salt")
         VALUES (:userId, :hashedPassword, :salt)`,
        {
          replacements: { userId, hashedPassword, salt },
          type: QueryTypes.INSERT,
          transaction
        }
      );
  
      await sendMail({
        to: email,
        subject: 'SOFTSHARES - Account Creation',
        body: 'This email serves as a notification for successful account password creation. Your new password will be needed every time you log in and will be valid for the next 6 months. You will receive an email reminder to change your password one week before it expires. According to our company security policies, passwords cannot be reused.'
      });
  
      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
};

const spChangeUserPassword = async (userId, email, newPassword) => {
    const transaction = await db.sequelize.transaction();
    try {
      const salt = generateSalt();
      const hashedPassword = hashPassword(newPassword, salt);
  
      const [previousPassword] = await db.sequelize.query(
        `SELECT 1 FROM "security"."user_passwords_dictionary"
         WHERE "user_id" = :userId AND "hashed_password" = :hashedPassword`,
        {
          replacements: { userId, hashedPassword },
          type: QueryTypes.SELECT,
          transaction
        }
      );
  
      if (previousPassword) {
        throw new Error('The new password must not be the same as any previously used passwords.');
      }
  
      await db.sequelize.query(
        `UPDATE "hr"."users" SET "hashed_password" = :hashedPassword WHERE "user_id" = :userId`,
        {
          replacements: { hashedPassword, userId },
          type: QueryTypes.UPDATE,
          transaction
        }
      );
  
      await db.sequelize.query(
        `INSERT INTO "security"."user_passwords_dictionary" ("user_id", "hashed_password", "salt")
         VALUES (:userId, :hashedPassword, :salt)`,
        {
          replacements: { userId, hashedPassword, salt },
          type: QueryTypes.INSERT,
          transaction
        }
      );
  
      await sendMail({
        to: email,
        subject: 'SOFTSHARES - Account Action - Password Changes',
        body: 'This email serves as a notification for successful account password modification. If you did not take this action, please inform your security team right away!'
      });
  
      await logUserAction(userId, 'PASSWORD CHANGE', 'Changed account password', transaction);
  
      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
};
  

const spDeactivateUser = async (userId) => {
    const transaction = await db.sequelize.transaction();
    try {
      await db.sequelize.query(
        `UPDATE "security"."user_account_details" SET "account_status" = 0 WHERE "user_id" = :userId`,
        {
          replacements: { userId },
          type: QueryTypes.UPDATE,
          transaction
        }
      );
  
      const [user] = await db.sequelize.query(
        `SELECT "email" FROM "hr"."users" WHERE "user_id" = :userId`,
        {
          replacements: { userId },
          type: QueryTypes.SELECT,
          transaction
        }
      );
  
      if (user && user.email) {
        await sendMail({
          to: user.email,
          subject: 'SOFTSHARES - Account Status Change',
          body: 'This email serves to inform you that your Softshares account has been deactivated.'
        });
      }
  
      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
};
  
const spActivateUser = async (userId) => {
    const transaction = await db.sequelize.transaction();
    try {
      await db.sequelize.query(
        `UPDATE "security"."user_account_details" SET "account_status" = 1 WHERE "user_id" = :userId`,
        {
          replacements: { userId },
          type: QueryTypes.UPDATE,
          transaction
        }
      );
  
      const [user] = await db.sequelize.query(
        `SELECT "email" FROM "hr"."users" WHERE "user_id" = :userId`,
        {
          replacements: { userId },
          type: QueryTypes.SELECT,
          transaction
        }
      );
  
      if (user && user.email) {
        await sendMail({
          to: user.email,
          subject: 'SOFTSHARES - Account Status Change',
          body: 'This email serves to inform you that your Softshares account has been activated.'
        });
      }
  
      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
};
  
const spSetCenterAdmin = async (userId, officeId, city) => {
    const transaction = await db.sequelize.transaction();
    try {
      const [userExists] = await db.sequelize.query(
        `SELECT 1 FROM "hr"."users" WHERE "user_id" = :userId`,
        {
          replacements: { userId },
          type: QueryTypes.SELECT,
          transaction
        }
      );
  
      if (!userExists) {
        throw new Error(`UserID ${userId} does not exist.`);
      }
  
      const [officeExists] = await db.sequelize.query(
        `SELECT 1 FROM "centers"."offices" WHERE "office_id" = :officeId`,
        {
          replacements: { officeId },
          type: QueryTypes.SELECT,
          transaction
        }
      );
  
      if (!officeExists) {
        throw new Error(`OFFICE_ID ${officeId} does not exist.`);
      }
  
      await db.sequelize.query(
        `INSERT INTO "centers"."office_admins" ("office_id", "manager_id")
         VALUES (:officeId, :userId)`,
        {
          replacements: { officeId, userId },
          type: QueryTypes.INSERT,
          transaction
        }
      );
  
      console.log(`UserID ${userId} has been set to admin to ${officeId}.`);
  
      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
};

const spCheckPasswordExpiry = async () => {
    try {
      await db.sequelize.query(
        `INSERT INTO "security"."passwd_expiring_notifications" ("user_id", "notif_date")
         SELECT "user_id", NOW()
         FROM "security"."user_passwords_dictionary"
         WHERE "valid_to" = CURRENT_DATE + INTERVAL '7 days'
           AND "user_id" NOT IN (
             SELECT "user_id" FROM "security"."passwd_expiring_notifications" WHERE "is_notified" = 0
           )`,
        {
          type: QueryTypes.INSERT
        }
      );
    } catch (error) {
      throw error;
    }
};

const spSendPasswordExpiryNotification = async (email) => {
    try {
      const subject = 'Password Expiry Notification';
      const content = 'Your password is set to expire in 7 days. Please update your password to ensure uninterrupted access to your account.';
  
      await sendMail({
        to: email,
        subject,
        text: content
      });
  
      console.log(`Email sent to ${email}`);
    } catch (error) {
      throw error;
    }
};
  
  
  

module.exports = {
    spAssignUserToCenter,
    spSendWelcomeEmail,
    spRegisterNewUser,
    spCreateUserPassword,
    spChangeUserPassword,
    spDeactivateUser,
    spActivateUser,
    spSetCenterAdmin,
    spCheckPasswordExpiry,
    spSendPasswordExpiryNotification
}