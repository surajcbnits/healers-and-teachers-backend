var express = require("express");
const {
  updateMemberController,
  deleteMemberController,
  loginController,
  registerController,
  getMemberDetailController,
  getAllMembersListController,
} = require("../controllers/member");
const { isLogin, fileUpload } = require("../middleware");
var router = express.Router();

router.post("/register", fileUpload.single("upload"),  registerController);
router.post("/login", loginController);
router.delete("/deleteMember",isLogin, deleteMemberController);
router.put("/updateMember", fileUpload.single("upload"),  isLogin, updateMemberController);
router.get("/getMemberDetail", getMemberDetailController);
router.get("/getAllMembersList", getAllMembersListController);

module.exports = router;
