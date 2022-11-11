var express = require("express");
const { createUserController, deleteUserController, loginController } = require("../controllers/users");
var router = express.Router();


router.post("/register", registerController);
router.post("/login", loginController);
router.delete("/deleteUser", deleteUserController);
router.post("/createUser", createUserController);


module.exports = router;