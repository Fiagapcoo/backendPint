const jwt = require("jsonwebtoken");
const { verifyToken } = require("../utils/tokenUtils");
const controllers = {};

controllers.validation = async (req, res, next) => {
  console.log('req.headers:', JSON.stringify(req.headers, null, 2));
  // console.log('req.query:', JSON.stringify(req.query, null, 2));
  // console.log('req.body:', JSON.stringify(req.body, null, 2));
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Bearer <token>
  console.log('inside token: ' + token);
  
  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }
  console.log('Token received:', JSON.parse(token));
  const encryptedToken = JSON.parse(token); // Ensure token is parsed if sent as a stringified object
  const user = verifyToken(encryptedToken);
  if (user == null) {
    return res.status(403).json({ message: "Invalid token" });
  }
  req.user = user;
  next();
};

controllers.validation_noenc = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Bearer <token>
  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if(err) return res.sendStatus(403);
      req.user = user;    
      next();
  });
};

module.exports = controllers;
