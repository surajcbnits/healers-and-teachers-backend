var express = require("express");
const {
  updateUserController,
  deleteUserController,
  loginController,
  registerController,
} = require("../controllers/users");
const { isLogin } = require("../middleware");
var router = express.Router();

router.post("/register", registerController);
router.post("/login", loginController);
router.delete("/deleteUser", deleteUserController);
router.put("/updateUser", isLogin, updateUserController);

module.exports = router;
