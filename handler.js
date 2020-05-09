// import express from "express";
// React apps get Transpiled
// This version of NodeJS does support import statements and there is no transpilation step

const serverlessHttp = require("serverless-http");
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mysql = require("mysql");

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: "Tasks"
});


// Logically separate 4 sections of code according to the method of the HTTP request received

// Export a single function, called app

const app = express();
app.use(cors());
app.use(bodyParser.json());

// https://fjr832ry.api-gateway.aws.com/tasks (backend URL example)
// https://harrietty.github.com/todos_frontend (frontend URL example)

app.get("/tasks", function (request, response) {
  // Should make a SELECT * FROM Tasks query to the DB and return the results
  connection.query("SELECT * FROM Task", function (err, data) {
    if (err) {
      console.log("Error from MySQL", err);
      response.status(500).send(err);
    } else {
      response.status(200).send(data);
    }
  });
});

app.delete("/tasks/:id", function (request, response) {
  const id = request.params.id;
  const query = "DELETE FROM Task WHERE TaskId = ?";
  connection.query(query, [id], (err) => {
    if (err) {
      console.log("Error from MySQL", err);
      response.status(500).send(err);
    } else {
      response.status(200).send("Task deleted");
    }
  });
});

/*
{
	"Narrative": "Wash the dog",
	"DueDate": "2020-04-24",
  "Urgent": true
  Completed: true
  AddTask: false
}
*/

app.post("/tasks", function (request, response) {
  const data = request.body;
  const query = `INSERT INTO Task (Narrative, Date, Urgency, Completed, addTask, userID) VALUES (?, ?, ?, ?, ?, ?)`;
  connection.query(
    query,
    [data.Narrative, data.Date, data.Urgency, false, false, data.userID],
    function (err, results) {
      if (err) {
        console.log("Error from MySQL", err);
        response.status(500).send(err);
      } else {
        // Send back the newly created task
        // Because the frontend (or whatever client) might want to know the ID
        connection.query(
          `SELECT * FROM Task WHERE taskId = ${results.insertId}`,
          function (err, results) {
            if (err) {
              console.log("Error from MySQL", err);
              response.status(500).send(err);
            } else {
              response.status(201).send(results[0]);
            }
          }
        );
      }
    }
  );
});

app.put("/tasks/:id", function (request, response) {
  const id = request.params.id;
  const data = request.body;// { Urgent: true, Completed: false }
  const query = "UPDATE Task SET ? WHERE TaskID = ?";
  connection.query(query, [data, id], (err) => {
    if (err) {
      console.log("Error from MySQL", err);
      response.status(500).send(err);
    } else {
      response.status(200).send("Updated Task");
    }
  });
});


module.exports.app = serverlessHttp(app);
