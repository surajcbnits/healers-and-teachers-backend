const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

require('dotenv').config();

//import routes
const memberRoutes = require("./routes/member");
const memberEventsRoutes = require("./routes/memberEvents");
const memberServicesRoutes = require("./routes/memberServices");
const wellnessKeywordsRoutes = require("./routes/wellnessKeywords");
const db = require("./models");


const app = express();

const corsOptions = {
  origin: "*",
};
app.use(cors(corsOptions));

// parse requests of content-type - application/json

app.use(bodyParser.json());
// parse requests of content-type - application/x-www-form-urlencoded

app.use(bodyParser.urlencoded({ extended: true }));

//my routes
app.use("/api", memberRoutes);
app.use("/api", memberEventsRoutes);
app.use("/api", memberServicesRoutes);
app.use("/api", wellnessKeywordsRoutes);

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, (error) => {
  if (!error)
    console.log(
      "Server is Successfully Running, and App is listening on port " + PORT
    );
  else console.log("Error occurred, server can't start", error);
});

// connecting to the DB 
db.sequelize.sync({ alter: true }).then(function() {
  console.log('connected to database ')
}).catch(function(err) {
  console.log(err)
});
