var express = require("express");
const { createMemberServicesController } = require("../controllers/memberServices");

const { isLogin } = require("../middleware");
var router = express.Router();

router.post("/createMemberServices", isLogin, createMemberServicesController);

module.exports = router;
