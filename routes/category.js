var express = require("express");
const { createCategoryController } = require("../controllers/category");
const { fileUpload } = require("../middleware");
// const { createCategoryController } = require("../controllers/wellnessKeywords");


// const { isLogin } = require("../middleware");
var router = express.Router();

router.post("/createCategory", fileUpload.single("upload"), createCategoryController);


module.exports = router;
