const express = require("express");
require("dotenv").config();
const app = express();
app.use(express.json());
const Joi = require("joi");
const bcrypt = require("bcryptjs");
const db = require("../db/database");
const route = express.Router();
const jwt = require("jsonwebtoken");
const schema = Joi.object({
  name: Joi.string().min(3).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(3).required(),
});

const paginate = async (req, res) => {
  const ip =
    req.headers["x-forwarded-for"]?.split(",")[0].trim() || // Check for proxies
    req.socket.remoteAddress || // Modern replacement for req.connection.remoteAddress
    req.connection?.remoteAddress; // Fallback for older Node versions

  console.log("Client IP:", ip);
  const paginate = await db
    .select("*")
    .from("users")
    .limit(3)
    .offset(7)
    .orderBy("id", "asc");
  res.json({ message: paginate });
};

const Aggregate = async (req, res) => {
  const Aggregate = await db("users").count("age");
  res.json({ message: Aggregate });
};

const like = async (req, res) => {
  const like = await db("users").select("*").where("name", "like", "a%");
  res.json({ message: like });
};

const userLoginApi = async (req, res) => {
  try {
    const data = {
      email: req.body.email,
      password: req.body.password,
    };
    const loginSchema = Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().min(3).required(),
    });
    // const [extracting] = extract(schema, ["email", "password"]);
    // const extracting = schema.extract(["email"]);
    const { error } = loginSchema.validate(data);
    if (error) {
      return res.status(400).json({
        message: `login failed Email not found error: ${error.message}`,
      });
    }
    const [userdata] = await db("users").where("email", data.email);
    if (!userdata) {
      return res.json({ message: "email not found" });
    } else {
      const token = jwt.sign({ id: userdata.id }, process.env.SECRET); //
      const user = await db("users").where("email", data.email).first();
      if (user) {
        return res.json({ message: "login success", token });
      }
    }
  } catch (e) {
    return res.status(400).json({ message: e });
  }
};
const userSignUpApi = async (req, res) => {
  try {
    let data = {
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
    };

    const { error } = schema.validate(data);

    if (error) {
      return res.json({ Validationerror: error.details[0].message });
    }
    const user = await db("users").where("email", data.email).first();
    // if (user) {
    //   return res.json({ message: "Email exists", user });
    // }
    // else {
    let passwordHash = bcrypt.hashSync(data.password, 8);
    const id = await db("users")
      .insert({
        name: data.name,
        email: data.email,
        password: passwordHash,
      })
      .returning("id");
    return res.status(201).json({ message: `user hase been registered` });
    // }
  } catch (e) {
    return res.json({ errormessage: e.detail });
  }
};
route.get("/paginate", paginate);
route.get("/like", like);
route.get("/Aggregate", Aggregate);
route.post("/userLoginApi", userLoginApi);
route.post("/userSignUpApi", userSignUpApi);
module.exports = route;
