const express = require("express");
const fs = require("fs-extra");
const path = require("path");
const Joi = require("joi");
const app = express();
const knex = require("./db/database.js");
const cron = require("node-cron");
const route = require("./routes/todos.js");
const users = require("./routes/users.js");
const e = require("express");

app.use(express.json());
app.use("/", route);
app.use("/", users);
const logFilePath = path.join(__dirname, "invoice.json");

const logFilePath1 = path.join(__dirname, "test.txt");

function logMessage(message) {
  const timestamp = new Date().toISOString();
  fs.appendFileSync(logFilePath, `${timestamp} - ${message}\n`, "utf8");
}
async function checkDatabase() {
  try {
    const overdueTasks = await knex("todos").where("status", "overdue");

    if (overdueTasks.length > 0) {
      logMessage(`Overdue tasks found:${await getDataViaStatus()}`);
      overdueTasks.forEach((task) => {
        logMessage(`- Task ID: ${task.id}, Due Date: ${task.due_date}`);
      });
    } else {
      logMessage("No overdue tasks found.");
    }
  } catch (error) {
    logMessage("Error querying database: " + error.message);
  }
}

async function getFullData() {
  try {
    const data = await knex("todos").select("*");
    console.table(data);
    return data;
  } catch (err) {
    console.error("Error fetching data:", err);
  }
}

const getDataViaStatus = async (status) => {
  try {
    const data = await knex("todos").select("*").where({ status: status });
    // console.log(data);
    const newData = JSON.stringify(data);

    if (data.length > 0) {
      fs.appendFileSync(logFilePath, ` ${newData}\n`, "utf8");
      fs.appendFileSync(logFilePath1, ` ${newData}\n`, "utf8");

      // return res.json({ data: newData });
      console.log(newData);
      return newData;
    }
  } catch (err) {
    console.error("Error fetching data:", err);
  }
};

// cron.schedule("*/2 * * * * *", async () => {
//   console.log("Cron job running...");
//   console.log("Checking the database and logging results to test.txt...");
//   const data = await getDataViaStatus("completed");
//   if (data) {
//     console.log("Cron job logged data successfully.");
//   } else {
//     console.log("No data to log.");
//   }
// });

// app.post("/cron", async (req, res) => {
//   const status = req.body.status;
//   const data = await getDataViaStatus(status);
//   console.log("gsahgsha-----------------", typeof data);
//   if (data) {
//     return res.json({ data: data });
//   } else {
//     return res.json({ message: "No data found" });
//   }
// });

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
