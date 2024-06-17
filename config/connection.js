// Imports the connect and connection objects from mongoose.
const { connect, connection } = require("mongoose");

// Sets the variable connectionString to the local MongoDB server with the thoughtsDB database.
const connectionString = "mongodb://127.0.0.1:27017/thoughtsDB";

// Invokes the connect function to the connectionString.
connect(connectionString);

// Exports the connections so other modules can access the mongoDB connection created above.
module.exports = connection;
