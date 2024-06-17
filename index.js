// Allows use of the express and custom modules.
const express = require("express");
const db = require("./config/connection");
const routes = require("./routes");

// Defines a constant for PORT.
const PORT = 3001;

// Initializes the express application.
const app = express();

// Sets up middleware for parsing incoming requests.
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Mounts the routes defined in the routes module on the Express application.
app.use(routes);

// Waits for the database connection to open and then starts the server.
db.once("open", () => {
  app.listen(PORT, () => {
    console.log("Server listening on: http://localhost:" + PORT);
  });
});
