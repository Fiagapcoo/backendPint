const db = require("../models");
const jwt = require("jsonwebtoken");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const { sendMail } = require("./emailController");
const { logUserAction, updateAccessOnLogin, sp_verifyUser, sp_updateLastAccess} = require('../database/logic_objects/usersProcedures');


const {
  spRegisterNewUser,
  spCreatePassword,
  sp_findUserById,
  sp_findUserByEmail
} = require("../database/logic_objects/securityProcedures");

const controllers = {};

function mashupAndRandomize(email, firstName, lastName) {
  const combinedString = email + firstName + lastName;
  const charArray = combinedString.split("");

  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  const shuffledArray = shuffleArray(charArray);
  return shuffledArray.join("");
}

controllers.register = async (req, res) => {
  const { email, firstName, lastName, centerId } = req.body;

  if (!validator.isEmail(email)) {
    return res.status(400).json({ message: "Invalid email" });
  }
  if (
    validator.isEmpty(firstName) ||
    !validator.isAlpha(firstName, "en-US", { ignore: " " })
  ) {
    return res.status(400).json({ message: "Invalid first name" });
  }
  if (
    validator.isEmpty(lastName) ||
    !validator.isAlpha(lastName, "en-US", { ignore: " " })
  ) {
    return res.status(400).json({ message: "Invalid last name" });
  }

  try {
    const user = await spRegisterNewUser(firstName, lastName, email, centerId);

    console.log("user:", user);

    // Assegure que 'user' seja um objeto simples
    if (Array.isArray(user) && user.length > 0) {
      const userPayload = {
        id: user[0].user_id, // Acesse o primeiro elemento do array
      };
      console.log("userPayload:", userPayload);

      const token = jwt.sign(userPayload, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });
      const random_sub_url = mashupAndRandomize(email, firstName, lastName) 
      const url = `${process.env.CLIENT_URL}/setup-password/${random_sub_url}?token=${token}`;
      console.log("url:", url);
      console.log("user:", user);

      await sendMail({
        to: email,
        subject: "Set up your new password",
        body: `Link: ${url}`,
      });

      res
        .status(201)
        .json({
          success: true,
          message:
            "User registered successfully. Please check your email to set up your password.",
        });
    }
  } catch (error) {
    console.error("CONSOLE LOG REGISTER:", error);
    res
      .status(500)
      .json({ success: false, message: "Internal server error: " + error });
  }
};

controllers.setupPassword = async (req, res) => {
  const {password } = req.body;

//   if (!validator.isJWT(token)) {
//     return res.status(400).json({ success: false, message: "Invalid token" });
//   }
  if (!validator.isStrongPassword(password)) {
    return res
      .status(400)
      .json({ success: false, message: "Password is not strong enough" });
  }
  try {
    const userId = req.user.id;



    await spCreatePassword(userId, password);
    

    const user = await sp_findUserById(userId);
    console.log("user:", user);
    console.log("user:", user);
    await sendMail({
      to: user.email,
      subject: "Password Setup Successful",
      body: "Your password has been set up successfully.",
    });

    
    await logUserAction(userId, 'PASSWORD CREATED', 'Created user account password');
    res
      .status(200)
      .json({ success: true, message: "Password set up successfully." });
  } catch (error) {
    console.error("Error setting up password:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

controllers.UpdatePassword = async (req, res) => {
  const {password} = req.body;

//   if (!validator.isJWT(token)) {
//     return res.status(400).json({ success: false, message: "Invalid token" });
//   }
  if (!validator.isStrongPassword(password)) {
    return res
      .status(400)
      .json({ success: false, message: "Password is not strong enough" });
  }
  try {
    console.log("req.user:", req.user.id);
    const userId = req.user.id;

    const salt = bcrypt.genSalt(12);

    const hashedPassword = bcrypt.hash(password, salt);

    // await (userId, hashedPassword, salt);
    

    const user = await sp_findUserById(userId);
    console.log("user:", user);
    await sendMail({
      to: user.email,
      subject: "Password Updated Successful",
      body: "Your password has been Updated successfully.",
    });

    res
      .status(200)
      .json({ success: true, message: "Password set up successfully." });
  } catch (error) {
    console.error("Error setting up password:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

//check cookie
// app.get('/data', cookieParser(),  function(req, res) {
//   var csrf = req.get('CSRF');
//   var str = req.cookies['jwt'];
//   try {
//     let jwtPayload = jwt.verify(str, KEY);
//     let csrfPayload = jwt.verify(csrf, KEY);
//     if(jwtPayload["type"] != 'access')
//       throw "invalid jwt payload";
//     if(csrfPayload["type"] != 'csrf')
//       throw "invalid anti-CSRF token payload"
//     res.send("Very Secret Data");
//   } catch(e) {
//     console.error(e);
//     res.status(401);
//     res.send("Bad Token");
//   }

// });

controllers.login_web = async (req, res) => {
  const { email, password } = req.body;

  if (!validator.isEmail(email)) {
    return res.status(400).json({ success: false, message: "Invalid email" });
  }
  if (validator.isEmpty(password)) {
    return res
      .status(400)
      .json({ success: false, message: "Password cannot be empty" });
  }

  try {
    const user = await sp_findUserByEmail(email);
    console.log("user:", user);
 
    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid email or password" });
    }

    const validation = await sp_verifyUser(user.user_id);
    console.log("validation:", validation);

    if(validation.account_status == false || validation.account_restriction == true){
      return res
        .status(401)
        .json({ success: false, message: "Account is not active or restricted! Contact your admin!" });
    }

    const isMatch = await bcrypt.compare(password, user.hashed_password);

    if (!isMatch) {
      await updateAccessOnLogin(user.user_id);
      return res
        .status(401)
        .json({ success: false, message: "Invalid email or password" });
    }
    if (user.role_id != 1)
    {    
      // jwt with encryption
      // var payload = {
      //   username: user.user_id,
      //   type: 'access'
      // };

      // var csrfPayload = {
      //   username: user.user_id,
      //   type: 'csrf'
      // };

      // var token = jwt.sign(payload, KEY, {algorithm: 'HS256', expiresIn: "4h"});
      // var csrf = jwt.sign(csrfPayload, KEY, {algorithm: 'HS256', expiresIn: "4h"});
      // console.log("Success");
      // res.cookie('jwt', token, {magAge: 4*60*60*1000, httpOnly: true/*, secure: true */});
      // res.send(csrf);
      
      const token = jwt.sign({ id: user.user_id }, process.env.JWT_SECRET, {
            expiresIn: "4h",
            });
            
        await sp_updateLastAccess(user.user_id); //TODO - check this
        res.status(200).json({ token, success: true, message: "Login successful" });
    }
    else res.status(403).json({ success: false, message: "Dont have permission to access! Contact your admin!" });
    
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

controllers.login_mobile = async (req, res) => {
  const { email, password } = req.body;

  if (!validator.isEmail(email)) {
    return res.status(400).json({ success: false, message: "Invalid email" });
  }
  if (validator.isEmpty(password)) {
    return res
      .status(400)
      .json({ success: false, message: "Password cannot be empty" });
  }

  try {
    const user = await sp_findUserByEmail(email);

    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid email or password" });
    }

    const validation = await sp_verifyUser(user.user_id);
    console.log("validation:", validation);

    if(validation.account_status == false || validation.account_restriction == true){
      return res
        .status(401)
        .json({ success: false, message: "Account is not active or restricted! Contact your admin!" });
    }

    const isMatch = await bcrypt.compare(password, user.hashed_password);

    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid email or password" });
    }

    const token = jwt.sign({ id: user.user_id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    await sp_updateLastAccess(user.user_id); //TODO - check this
    res.status(200).json({ token, success: true, message: "Login successful" });
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};






controllers.testjwt = async (req, res) => {
  const info = {
    id: 1,
    email: "abc@gmail.com",
  };

  const token = jwt.sign(info, process.env.JWT_SECRET, { expiresIn: "1h" });
  console.log("token:", token);
};

controllers.validateToken = async (req, res) => {
  const { token } = req.body;

   try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("decoded:", decoded);
    res.status(200).json({ success: true, message: "Token is valid" });
  } catch (error) {
    console.error("Error validating token:", error);
    res.status(401).json({ success: false, message: "Invalid token" });
  }
}

controllers.getUserByToken = async (req, res) => {
  const user_id = req.user.id;

  try {
    const user = await sp_findUserById(user_id);
    res.status(200).json({ success: true, user });
    
  } catch (error) {
    console.error("Error getting user by token:", error);
  }
}

controllers.updateLastAccess = async (req, res) => {
  const user_id = req.user.id;

  try {
    await sp_updateLastAccess(user_id);
    res.status(200).json({ success: true, message: "Last access updated" });

    
  } catch (error) {
    console.error("Error updating last access:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
}

module.exports = controllers;
