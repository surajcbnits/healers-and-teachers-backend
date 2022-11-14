const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

//import routes
const memberRoutes = require("./routes/member");


const app = express();

const corsOptions = {
  origin: "http://localhost:8080/",
};
app.use(cors(corsOptions));

// parse requests of content-type - application/json

app.use(bodyParser.json());
// parse requests of content-type - application/x-www-form-urlencoded

app.use(bodyParser.urlencoded({ extended: true }));

//my routes
app.use("/api", memberRoutes);

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, (error) => {
  if (!error)
    console.log(
      "Server is Successfully Running, and App is listening on port " + PORT
    );
  else console.log("Error occurred, server can't start", error);
});
