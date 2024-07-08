const jwt = require("jsonwebtoken");
const { verifyToken } = require("../utils/tokenUtils");
const controllers = {};

controllers.validation = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Bearer <token>
  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }
  var res = verifyToken(token);
  if (res == null) {
    return res.sendStatus(403);
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
