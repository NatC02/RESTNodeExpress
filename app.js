import express from "express";
import db from "./db/db";

//This is the middleware, in express they typically use the word next to define what happens beyond the req and res object
import router from "./routes/index.js";

import todoController from "../todosControllers/todos";

import bodyParser from "body-parser";

// Set up the express app
const app = express();

// Parses incoming requests data
app.use(urlencoded({ extended: false }));
app.use(router); //lets you use the middleware

// get all todos
app.get("/api/v1/todos", (req, res) => {
  res.status(200).send({
    success: "true",
    message: "todos retrieved successfully",
    todos: db,
  });
});
const PORT = 5000;

app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});

// Creating another todo through a post request

app.post("/api/v1/todos", (req, res) => {
  if (!req.body.title) {
    return res.status(400).send({
      success: "false",
      message: "title is required",
    });
  } else if (!req.body.description) {
    return res.status(400).send({
      success: "false",
      message: "description is required",
    });
  }
  const todo = {
    id: db.length + 1,
    title: req.body.title,
    description: req.body.description,
  };
  db.push(todo);
  return res.status(201).send({
    success: "true",
    message: "todo added successfully",
    todo,
  });
});

//Getting a todo from the database using endpoint below

app.get("/api/v1/todos/:id", (req, res) => {
  const id = parseInt(req.params.id, 10);
  db.map((todo) => {
    if (todo.id === id) {
      return res.status(200).send({
        success: "true",
        message: "todo retrieved successfully",
        todo,
      });
    }
  });
  return res.status(404).send({
    success: "false",
    message: "todo does not exist",
  });
});

//Deleting entries in a database using endpoint below

app.delete("/api/v1/todos/:id", (req, res) => {
  const id = parseInt(req.params.id, 10);

  db.map((todo, index) => {
    if (todo.id === id) {
      db.splice(index, 1);
      return res.status(200).send({
        success: "true",
        message: "Todo deleted successfuly",
      });
    }
  });

  return res.status(404).send({
    success: "false",
    message: "todo not found",
  });
});

//Endpoint that updates todo list

app.put("/api/v1/todos/:id", (req, res) => {
  const id = parseInt(req.params.id, 10);
  let todoFound;
  let itemIndex;
  db.map((todo, index) => {
    if (todo.id === id) {
      todoFound = todo;
      itemIndex = index;
    }
  });

  if (!todoFound) {
    return res.status(404).send({
      success: "false",
      message: "todo not found",
    });
  }

  if (!req.body.title) {
    return res.status(400).send({
      success: "false",
      message: "title is required",
    });
  } else if (!req.body.description) {
    return res.status(400).send({
      success: "false",
      message: "description is required",
    });
  }

  const updatedTodo = {
    id: todoFound.id,
    title: req.body.title || todoFound.title,
    description: req.body.description || todoFound.description,
  };

  db.splice(itemIndex, 1, updatedTodo);

  return res.status(201).send({
    success: "true",
    message: "todo added successfully",
    updatedTodo,
  });
});
