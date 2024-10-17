const express = require("express");
const Joi = require("joi");
const knex = require("../db/database");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const verify = require("./mware");
const route = express.Router();

/* The `const schema` in the provided code snippet is defining a Joi schema object for validating the
data structure of a todo item. Here's a breakdown of what the schema is doing: */
const schema = Joi.object({
  title: Joi.string().min(3).max(255).required(),
  description: Joi.string().optional(),
  status: Joi.string()
    .valid("pending", "in progress", "completed", "overdue")
    .required(),
});

const todosupdate = async (req, res) => {
  try {
    const jwtID = req.user.id;
    const iat = req.user.iat;
    console.log(iat);
    const id = req.body.id;
    const status = req.body.status;
    const extracting = schema.extract(["status"]);
    const { error } = extracting.validate(status);
    if (error) {
      console.log(error);
      return res.status(201).json({ message: " validation error" });
    }

    if (jwtID === id) {
      const [todo] = await knex("todos").where({
        id: id,
      });
      if (id && status !== todo.status) {
        const updated = await knex("todos")
          .where({
            id: id,
          })
          .update({
            status: status,
          });
        return res.json({
          msg: updated,
        });
      } else {
        return res.json({ msg: "you are not allowed to update such record" });
      }
    } else {
      return res.status(403).json({ message: " Unauthorized" });
    }
  } catch (e) {
    return res.status(400).json({ message: e });
    // throw e; //internal server error(return 500)don't throw in api ever
    //only define schema once use extract from joi docs
  }
};

const getstatus = async (req, res) => {
  try {
    const jwtID = req.user.id;
    const id = req.body.id;
    if (jwtID === id) {
      const [data] = await knex.select("*").from("todos").where({ id: id });
      // use return for res.json....await async or promise use one
      console.log(data);
      return res.json({
        status: data.status,
      });
    } else {
      return res.status(403).json({ message: " Unauthorized" });
    }
  } catch (e) {
    console.error(e);
    return res.json({ message: e });
  }
};

const deleteById = async (req, res) => {
  try {
    /* This code snippet is defining a function called `deleteById` that handles deleting a todo item
 based on the user's authorization. Here's a breakdown of what the code is doing: */
    const jwtID = req.user.id;
    console.log(userid);
    const id = req.body.id;
    console.log(id);

    if (id === jwtID) {
      const data = await knex.select("*").from("todos").where({ id: userid });
      if (data.length > 0) {
        const deletedusers = await knex("todos").where({ id: id }).del();
        return res.json({ msg: `no of deleted users=${deletedusers}` });
      } else {
        return res.json({ message: "already deleted" });
      }
    } else {
      return res.status(403).json({ message: " Unauthorized" });
    }
  } catch (e) {
    console.error(e);
    w;
    return res.json({ message: e });
  }
};

const todosInsert = async (req, res) => {
  try {
    let data = {
      title: req.body.title,
      description: req.body.description,
      status: req.body.status,
    };
    // console.log(data);
    const { error } = schema.validate(data);

    if (error) {
      return res.status(400).json({
        ValidationError: error.details.map((x) => x.message),
      });
    }
    const abc = await knex("todos").insert({
      title: data.title,
      description: data.description,
      status: data.status,
      due_date: new Date(),
    });
    // console.log(id);
    console.log("data: ", JSON.stringify(abc));

    return res.status(201).json({ message: "Todos task registered" });
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
};

// const joinById = async (req, res) => {
//   try {
//     const id = req.body.id;
//     const left_join = await knex("todos")
//       .leftJoin("users", "todos.user_id", "users.id")
//       .select("users.name", "users.email", "todos.title", "todos.description")
//       .where("todos.user_id", id);
//     return res.json({ left_join });
//   } catch (e) {
//     return res.json({ message: e });
//   }
// };

route.patch("/todosupdate", verify, todosupdate);
route.get("/getstatus", verify, getstatus);
route.delete("/deleteById", verify, deleteById);
route.post("/todosInsert", todosInsert);
module.exports = route;
