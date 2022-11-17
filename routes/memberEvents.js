var express = require("express");
const { createMemberEventsController, updateMemberEventsController, getMemberEventsByUserController } = require("../controllers/memberEvents");

const { isLogin } = require("../middleware");
var router = express.Router();

router.post("/createMemberEvents", isLogin, createMemberEventsController);
router.put("/updateMemberEvents", isLogin, updateMemberEventsController);
router.get("/getMemberEventsByUser", getMemberEventsByUserController);

module.exports = router;
