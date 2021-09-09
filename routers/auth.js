const express = require("express");
const Joi = require("@hapi/joi");
const bcrypt = require("bcrypt");
const dbDebugger = require("debug")("app:db");
const { Customer } = require("../schema/schema");

const router = express.Router();

router.post("/register", async (req, res) => {
  const data = req.body;
  try {
    const { error } = validateUser(data);
    if (error) return res.status(400).send(error.details[0].message);

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(data.password, salt);

    const user = await new Customer({
      username: data.username,
      email: data.email,
      password: hash,
      role: data.role,
    });

    const result = await user.save();
    const response = {
      username: data.username,
      email: data.email,
      role: data.role,
    };

    const token = user.generateAuthToken();

    res.header("auth_token", token).send(response);
  } catch (err) {
    dbDebugger(err);
    res.status(500).send(err);
  }
});

router.post("/login", async (req, res) => {
  const data = req.body;
  try {
    const { error } = validateUser(data);
    if (error) return res.status(400).send(error.details[0].message);

    const user = await Customer.find({ email: data.email });

    if (user.length === 0)
      return res.status(400).send("Email and password does not match");

    const isValid = await bcrypt.compare(data.password, user[0].password);
    if (!isValid)
      return res.status(400).send("Email and password does not match");

    const token = user.generateAuthToken();

    res.send(token);
  } catch (err) {
    dbDebugger(err);
    res.status(500).send(err);
  }
});

const validateUser = (user) => {
  const schema = Joi.object().keys({
    email: Joi.string().min(5).max(80).required().email(),
    password: Joi.string().min(6).max(80).required(),
    username: Joi.string().min(1).max(40).optional(),
    role: Joi.string(),
  });

  return Joi.validate(user, schema);
};

module.exports = router;
