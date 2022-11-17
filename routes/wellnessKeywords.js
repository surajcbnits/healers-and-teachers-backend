var express = require("express");
const { getAllWellnessKeywordsController } = require("../controllers/wellnessKeywords");


const { isLogin } = require("../middleware");
var router = express.Router();

router.get("/getAllWellnessKeywords", getAllWellnessKeywordsController);


module.exports = router;
