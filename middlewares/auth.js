const jwt = require("jsonwebtoken");

const authorize = (req, res, next) => {
  const token = req.header("auth_token");
  if (!token) return res.status(401).send("Access denied.Token is required.");

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    console.log(decoded);
    next();
  } catch (err) {
    res.status(401).send("Access denied.Token is tempered with.");
  }
};

module.exports = authorize;
