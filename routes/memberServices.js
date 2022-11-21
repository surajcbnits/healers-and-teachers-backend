var express = require("express");
const { createMemberServicesController, updateMemberServicesController, getMemberServicesByUserController, deleteMemberServicesController } = require("../controllers/memberServices");

const { isLogin } = require("../middleware");
var router = express.Router();

router.post("/createMemberServices", isLogin, createMemberServicesController);
router.put("/updateMemberServices", isLogin, updateMemberServicesController);
router.get("/getMemberServicesByUser", getMemberServicesByUserController);
router.delete("/deleteMemberServices", isLogin, deleteMemberServicesController);


module.exports = router;