var express = require("express");
const {
  updateMemberController,
  deleteMemberController,
  loginController,
  registerController,
  getMemberDetailController,
} = require("../controllers/member");
const { isLogin } = require("../middleware");
var router = express.Router();

router.post("/register", registerController);
router.post("/login", loginController);
router.delete("/deleteMember",isLogin, deleteMemberController);
router.put("/updateMember", isLogin, updateMemberController);
router.get("/getMemberDetail", getMemberDetailController);

module.exports = router;
