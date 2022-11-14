var express = require("express");
const {
  updateMemberController,
  deleteMemberController,
  loginController,
  registerController,
} = require("../controllers/member");
const { isLogin } = require("../middleware");
var router = express.Router();

router.post("/register", registerController);
router.post("/login", loginController);
router.delete("/deleteMember", deleteMemberController);
router.put("/updateMember", isLogin, updateMemberController);

module.exports = router;
