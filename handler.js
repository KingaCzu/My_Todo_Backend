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
  // Should delete the task with the specified ID from the database
  // Write a query in SQL
  // Escape the id that is provided by the user
  // Send back 200 status if successful
  response.status(200).send(`Deleted task with ID ${id}!`);
});

/*
{
	"Description": "Wash the dog",
	"DueDate": "2020-04-24",
	"Urgent": true
}
*/

pp.post("/tasks", function (request, response) {
  const data = request.body;

  // SQL Injection - avoid this by "escaping" user-provided values
  const query = `INSERT INTO Task (Description, DueDate, Completed, Urgent) VALUES (?, ?, ?, ?)`;
  connection.query(
    query,
    [data.Description, data.DueDate, false, data.Urgent],
    function (err, results) {
      if (err) {
        console.log("Error from MySQL", err);
        response.status(500).send(err);
      } else {
        // Send back the newly created task
        // Because the frontend (or whatever client) might want to know the ID
        connection.query(
          `SELECT * FROM Task WHERE TaskId = ${results.insertId}`,
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
  const data = request.body;
  // Write an SQL query to update the fields provided in the request for the task WHERE TaskId = id
  // Remember to escape user-provided values
  // Send back 200 (not the updated task)
  response
    .status(200)
    .send(`Updated task with ID ${id} and data ${JSON.stringify(data)}`);
});

module.exports.app = serverlessHttp(app);
