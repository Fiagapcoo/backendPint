const jwt = require("jsonwebtoken");
const crypto = require("crypto");
//require('dotenv').config();

//for mobile
const algorithm = "aes-256-cbc";
const key = Buffer.from(process.env.ENCRYPTION_KEY, "base64");
// const iv = Buffer.from(process.env.ENCRYPTION_IV, "base64");
//const key = crypto.randomBytes(32); // 256-bit key
const iv = crypto.randomBytes(16); // 128-bit IV

const encrypt = (text) => {
    const cipher = crypto.createCipheriv(algorithm, key, iv);
    let encrypted = cipher.update(text, 'utf8', 'base64');
    encrypted += cipher.final('base64');
  
    // console.log("Encrypting:");
    // console.log("IV:", iv.toString("hex"));
    // console.log("Encrypted Data:", encrypted);
  
    return { iv: iv.toString("hex"), encryptedData: encrypted };
  };
// const encrypt = (text) => {
//     const cipher = crypto.createCipheriv(algorithm, key, iv);
//     let encrypted = cipher.update(text);
//     encrypted = Buffer.concat([encrypted, cipher.final()]);
//     console.log("Encrypting:");
//     console.log("IV:", iv.toString("hex"));
//     console.log("Encrypted Data:", encrypted.toString("hex"));
//     return { iv: iv.toString("hex"), encryptedData: encrypted.toString("hex") };
//   };
const decrypt = (text) => {
  console.log("Decrypting:", text);
  try {
    if (!text || !text.iv || !text.encryptedData) {
      throw new Error("Invalid input for decryption");
    }
    let iv = Buffer.from(text.iv, "hex");
    let encryptedText = Buffer.from(text.encryptedData, "base64");
    let decipher = crypto.createDecipheriv(algorithm, key, iv);
    let decrypted = decipher.update(encryptedText, 'base64', 'utf8');
    decrypted += decipher.final('utf8');
    //console.log("After decrypting: " + decrypted);
    return decrypted;
  } catch (e) {
    console.error("Decryption error:", e);
    return null;
  }
};
// const decrypt = (text) => {
//     console.log("Decrypting:", text);
//     try {
//       if (!text || !text.iv || !text.encryptedData) {
//         throw new Error("Invalid input for decryption");
//       }
//       let iv = Buffer.from(text.iv, "hex");
//       let encryptedText = Buffer.from(text.encryptedData, "hex");
//       let decipher = crypto.createDecipheriv(algorithm, key, iv);
//       let decrypted = decipher.update(encryptedText);
//       decrypted = Buffer.concat([decrypted, decipher.final()]);
//       console.log("After decrypting: " + decrypted);
//       return decrypted.toString();
//     } catch (e) {
//       console.error("Decryption error:", e);
//       return null;
//     }
//   };


const generateToken = (id, expiresIn) => {
  const token = jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn });
  console.log('token gerado: ' + token);
  return encrypt(token);
};

const generateRefreshToken = (id) => {
  const token = jwt.sign({ id }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRATION,
  });
  return encrypt(token);
};

const verifyToken = (encryptedToken) => {
  try {
    //console.log("Verifying Token:", encryptedToken);
    const decryptedToken = decrypt(encryptedToken);
    return jwt.verify(decryptedToken, process.env.JWT_SECRET);
  } catch (error) {
    console.error("Verification error:", error);
    return null;
  }
};

const verifyRefreshToken = (token) => {
  try {
    const decryptedToken = decrypt(token);
    return jwt.verify(decryptedToken, process.env.JWT_REFRESH_SECRET);
  } catch (error) {
    return null;
  }
};
/* 



const generateToken = (id) => {
  const token = jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRATION });
  return encrypt(token);
};

const generateRefreshToken = (id) => {
  const token = jwt.sign({ id }, process.env.JWT_REFRESH_SECRET, { expiresIn: process.env.JWT_REFRESH_EXPIRATION });
  return encrypt(token);
};

const verifyToken = (token) => {
  try {
    const decryptedToken = decrypt(token);
    return jwt.verify(decryptedToken, process.env.JWT_SECRET);
  } catch (error) {
    return null;
  }
};

const verifyRefreshToken = (token) => {
  try {
    const decryptedToken = decrypt(token);
    return jwt.verify(decryptedToken, process.env.JWT_REFRESH_SECRET);
  } catch (error) {
    return null;
  }
};

*/
// const generateToken = (id, _expires_in) => {
//   return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: _expires_in });
// };

// const generateRefreshToken = (id, _expires_in) => {
//   return jwt.sign({ id }, process.env.JWT_REFRESH_SECRET, { expiresIn: _expires_in });
// };

// const verifyToken = (token) => {
//   try {
//     return jwt.verify(token, process.env.JWT_SECRET);
//   } catch (error) {
//     return null;
//   }
// };

// const verifyRefreshToken = (token) => {
//   try {
//     return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
//   } catch (error) {
//     return null;
//   }
// };

module.exports = {
  generateToken,
  generateRefreshToken,
  verifyToken,
  verifyRefreshToken,
};

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
