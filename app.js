const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const db = require("./models");

const Users = db.users;

const app = express();

const corsOptions = {
  origin: "http://localhost:8080/",
};
app.use(cors(corsOptions));

// parse requests of content-type - application/json

app.use(bodyParser.json());
// parse requests of content-type - application/x-www-form-urlencoded

app.use(bodyParser.urlencoded({ extended: true }));

//simple route
app.get("/", (req, res) => {

    Users.create({
        id:2,
        firstName: "Jhon",
        lastName: "Doe"
    }).then(data => {
        console.log("data : ", data);
        // res.send(data);
      })
      .catch(err => {
        console.log("err : ", err);
        // res.status(500).send({
        //   message: err.message || "Some error occurred while creating the Book."
        // });
      });
  res.json({ message: "Welcome to H&T" });
});

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, (error) => {
  if (!error)
    console.log(
      "Server is Successfully Running, and App is listening on port " + PORT
    );
  else console.log("Error occurred, server can't start", error);
});
