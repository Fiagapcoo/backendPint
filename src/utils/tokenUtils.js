const jwt = require('jsonwebtoken');
const crypto = require('crypto');
//require('dotenv').config();

//for mobile
const algorithm = 'aes-256-cbc';
const key = crypto.randomBytes(32);
const iv = crypto.randomBytes(16);

const encrypt = (text) => {
    const cipher = crypto.createCipheriv(algorithm, Buffer.from(key), iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return { iv: iv.toString('hex'), encryptedData: encrypted.toString('hex') };
};
  
  const decrypt = (text) => {
    let iv = Buffer.from(text.iv, 'hex');
    let encryptedText = Buffer.from(text.encryptedData, 'hex');
    let decipher = crypto.createDecipheriv(algorithm, Buffer.from(key), iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
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
const generateToken = (id, _expires_in) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: _expires_in });
};

const generateRefreshToken = (id, _expires_in) => {
  return jwt.sign({ id }, process.env.JWT_REFRESH_SECRET, { expiresIn: _expires_in });
};


// const verifyToken = (token) => {
//   try {
//     return jwt.verify(token, process.env.JWT_SECRET);
//   } catch (error) {
//     return null;
//   }
// };

const verifyRefreshToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
  } catch (error) {
    return null;
  }
};

module.exports = { generateToken, 
                    generateRefreshToken, 
                    // verifyToken, 
                    verifyRefreshToken 
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