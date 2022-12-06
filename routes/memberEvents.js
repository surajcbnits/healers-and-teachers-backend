var express = require("express");
const { createMemberEventsController, updateMemberEventsController, getMemberEventsByUserController, deleteMemberEventsController } = require("../controllers/memberEvents");

const { isLogin, fileUpload } = require("../middleware");
var router = express.Router();

router.post("/createMemberEvents", fileUpload.single("upload"), isLogin, createMemberEventsController);
router.put("/updateMemberEvents", fileUpload.single("upload"), isLogin, updateMemberEventsController);
router.get("/getMemberEventsByUser", getMemberEventsByUserController);
router.delete("/deleteMemberEvents", isLogin, deleteMemberEventsController);

module.exports = router;
