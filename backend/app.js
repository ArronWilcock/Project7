// Required packages and file paths declared
const express = require("express");
const db = require("./models");

// express app is declared by using express like a function
const app = express();

const path = require("path");

const userRoutes = require("./routes/user");
const postRoutes = require("./routes/post");
const commentRoutes = require("./routes/comment");

// middleware that takes incoming requests with content type application/json and makes its body available on the reponse object
app.use(express.json());

// Middleware to create headers for CORS (cross origin resource sharing)
// access control for Origin, Headers & Methods declared for the response objects
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

app.use("/images", express.static(path.join(__dirname, "images")));

app.use("/api/auth", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/posts", commentRoutes);

// express app exported so that it can be accessed outside the js file
module.exports = app;
