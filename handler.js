// import express from "express";
// React apps get Transpiled
// This version of NodeJS does support import statements and there is no transpilation step

const serverlessHttp = require("serverless-http");
const express = require("express");
const cors = require("cors");

// Logically separate 4 sections of code according to the method of the HTTP request received

// Export a single function, called app

const app = express();
app.use(cors());

// https://fjr832ry.api-gateway.aws.com/tasks (backend URL example)
// https://harrietty.github.com/todos_frontend (frontend URL example)

app.get("/tasks", function (request, response) {
  // Should make a SELECT * FROM Tasks query to the DB and return the results
  // For now, it's just going to return some dummy data

  // Request has loads of info about the request
  // Resposne has some useful methods for sending a response
  response.status(200).send({
    tasks: [
      {
        id: 1,
        text: "Wash the dishes",
      },
      {
        id: 2,
        text: "Wash the car",
      },
    ],
  });
});

app.delete("/tasks/:id", function (request, response) {
  // Should delete the task with the specified ID from the database
  // For now, just send back a text message (and status 200)
});

app.post("/tasks", function (request, response) {
  // Should INSERT INTO the database the new task
  // For now, just send back a text message (and status 200) "New task saved"
});

app.put("/tasks/:id", function (request, response) {
  // Should UPDATE a task in the DB
  // For now, just send back a text message (and status 200)
});

module.exports.app = serverlessHttp(app);
