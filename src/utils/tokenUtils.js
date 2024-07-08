const jwt = require('jsonwebtoken');
//require('dotenv').config();

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