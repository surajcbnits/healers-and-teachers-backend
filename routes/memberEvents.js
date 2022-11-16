var express = require("express");
const { createMemberEventsController } = require("../controllers/memberEvents");

const { isLogin } = require("../middleware");
var router = express.Router();

router.post("/createMemberEvents", isLogin, createMemberEventsController);

module.exports = router;
