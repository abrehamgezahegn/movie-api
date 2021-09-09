const dbDebugger = require("debug")("app:db");

const handleError = (err, req, res, next) => {
  dbDebugger("server error: ", err);
  res.status(500).send(err);
};

module.exports = handleError;
