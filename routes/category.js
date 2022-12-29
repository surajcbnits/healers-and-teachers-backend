var express = require('express');
const {
  createCategoryController,
  getAllCategoryController,
} = require('../controllers/category');
const { fileUpload } = require('../middleware');
var router = express.Router();

router.post(
  '/createCategory',
  fileUpload.single('upload'),
  createCategoryController
);
router.get('/getAllCategoryList', getAllCategoryController);

module.exports = router;
