const db = require("../models");
const jwt = require("jsonwebtoken");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const { sendMail } = require("./emailController");

const {
  generateToken,
  generateRefreshToken,
  verifyRefreshToken,
} = require("../utils/tokenUtils");

const {
  validateInput_Login,
  validateInput_register,
} = require("../utils/inputValidators");

const {
  logUserAction,
  updateAccessOnLogin,
  sp_verifyUser,
  sp_updateLastAccess,
} = require("../database/logic_objects/usersProcedures");

const {
  spRegisterNewUser,
  spCreatePassword,
  sp_findUserById,
  sp_findUserByEmail,
  spChangeUserPassword,
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
  console.log("req.body:", req.body);

  const validationResult = validateInput_register(email, firstName, lastName);
  if (!validationResult.valid) {
    return res
      .status(400)
      .json({ success: false, message: validationResult.message });
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
        expiresIn: 1300,
      });
      //await sp_insertUserAccDetails(user[0].user_id);
      const random_sub_url = mashupAndRandomize(email, firstName, lastName);

      const url = `${process.env.CLIENT_URL}/setup-password/${random_sub_url}?token=${token}`;
      console.log("url:", url);
      console.log("user:", user);

      await sendMail({
        to: email,
        subject: "Set up your new password",
        body: `Link: ${url}`,
      });

      res.status(201).json({
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
//TO ALTER - nao enviar email, dar set the password aqui. 
// so server admin pode usar
controllers.register_admin = async (req, res) => {
  const { email, firstName, lastName, centerId } = req.body;
  console.log("req.body:", req.body);

  const validationResult = validateInput_register(email, firstName, lastName);
  if (!validationResult.valid) {
    return res
      .status(400)
      .json({ success: false, message: validationResult.message });
  }

  try {
    const user = await spRegisterNewUser(firstName, lastName, email, centerId);

    console.log("user:", user);

    // makes sure user is a simple object
    if (Array.isArray(user) && user.length > 0) {
      const userPayload = {
        id: user[0].user_id, // access 1st elemnt of arrat
      };
      console.log("userPayload:", userPayload);

      const token = jwt.sign(userPayload, process.env.JWT_SECRET, {
        expiresIn: 1300,
      });
      //await sp_insertUserAccDetails(user[0].user_id);
      const random_sub_url = mashupAndRandomize(email, firstName, lastName);
      const url = `${process.env.CLIENT_URL}/setup-password/${random_sub_url}?token=${token}`;
      console.log("url:", url);
      console.log("user:", user);

      await sendMail({
        to: email,
        subject: "Set up your new password",
        body: `Link: ${url}`,
      });

      res.status(201).json({
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
  const { password } = req.body;

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

    await logUserAction(
      userId,
      "PASSWORD CREATED",
      "Created user account password"
    );
    res
      .status(200)
      .json({ success: true, message: "Password set up successfully." });
  } catch (error) {
    console.error("Error setting up password:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// TODO to test
controllers.UpdatePassword = async (req, res) => {
  const { password } = req.body;

  if (!validator.isStrongPassword(password)) {
    return res
      .status(400)
      .json({ success: false, message: "Password is not strong enough" });
  }
  try {
    console.log("req.user:", req.user.id);
    const userId = req.user.id;

    await spChangeUserPassword(userId, password);

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

const authenticateUser = async (email, password) => {
  const user = await sp_findUserByEmail(email);
  if (!user) {
    return { authenticated: false, message: "Invalid email or password" };
  }

  const validation = await sp_verifyUser(user.user_id);
  if (
    validation.account_status == false ||
    validation.account_restriction == true
  ) {
    return {
      authenticated: false,
      message: "Account is not active or restricted! Contact your admin!",
    };
  }

  const isMatch = await bcrypt.compare(password, user.hashed_password);
  if (!isMatch) {
    
    return { authenticated: false, message: "Invalid email or password" };
  }
  await updateAccessOnLogin(user.user_id);
  return { authenticated: true, user };
};

const handleResponseBasedOnRole = async (user, res) => {
  if (user.role_id != 1) {
    //const token = jwt.sign({ id: user.user_id }, process.env.JWT_SECRET, { expiresIn: "4h" });
    const token = generateToken(user.user_id);
    const refreshToken = generateRefreshToken(user.user_id);
    await sp_updateLastAccess(user.user_id);
    res.status(200).json({ token, refreshToken,success: true, message: "Login successful" });
  } else {
    res
      .status(403)
      .json({
        success: false,
        message: "Don't have permission to access! Contact your admin!",
      });
  }
};

controllers.login_web = async (req, res) => {
  const { email, password } = req.body;

  const validationResult = validateInput_Login(email, password);

  if (!validationResult.valid) {
    return res
      .status(400)
      .json({ success: false, message: validationResult.message });
  }

  try {
    const authResult = await authenticateUser(email, password);

    if (!authResult.authenticated) {
      return res
        .status(401)
        .json({ success: false, message: authResult.message });
    }

    await handleResponseBasedOnRole(authResult.user, res);
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

controllers.login_mobile = async (req, res) => {
  const { email, password } = req.body;
  const validationResult = validateInput_Login(email, password);

  if (!validationResult.valid) {
    return res
      .status(400)
      .json({ success: false, message: validationResult.message });
  }

  try {
    const authResult = await authenticateUser(email, password);

    if (!authResult.authenticated) {
      return res
        .status(401)
        .json({ success: false, message: authResult.message });
    }

    const token = generateToken(authResult.user.user_id);
    const refreshToken = generateRefreshToken(authResult.user.user_id);
    await sp_updateLastAccess(authResult.user.user_id); //TODO check this
    res
      .status(200)
      .json({
        token,
        refreshToken,
        success: true,
        message: "Login successful",
      });
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// controllers.testjwt = async (req, res) => {
//   const info = {
//     id: 1,
//     email: "abc@gmail.com",
//   };

//   const token = jwt.sign(info, process.env.JWT_SECRET, { expiresIn: "1h" });
//   console.log("token:", token);
// };

// controllers.validateToken = async (req, res) => {
//   const { token } = req.body;

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     console.log("decoded:", decoded);
//     res.status(200).json({ success: true, message: "Token is valid" });
//   } catch (error) {
//     console.error("Error validating token:", error);
//     res.status(401).json({ success: false, message: "Invalid token" });
//   }
// };

controllers.getUserByToken = async (req, res) => {
  const user_id = req.user.id;

  try {
    const user = await sp_findUserById(user_id);
    res.status(200).json({ success: true, user });
  } catch (error) {
    console.error("Error getting user by token:", error);
  }
};

controllers.refreshToken = async (req, res) => {
  const { refreshToken } = req.body;
  try {
    //console.log("ionside refresh" + refreshToken);
    const decoded = verifyRefreshToken(JSON.parse(refreshToken));
    //console.log(decoded);
    const accessToken = generateToken(decoded.id);
    res.status(200).json({ accessToken, success: true });
  } catch (error) {
    if(error instanceof jwt.TokenExpiredError){
      console.error("validation error:", error);
      return res.status(401).json({ message: "refresh token expired"  });
    }
    console.error("Error refreshing token:", error);
  }
};



module.exports = controllers;
