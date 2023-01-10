var express = require('express');
const {
  createCategoryController,
  getAllCategoryController,
  getCategoryDetailsByIdController,
  updateCategoryByIdController,
} = require('../controllers/category');
const { fileUpload } = require('../middleware');
var router = express.Router();

router.post(
  '/createCategory',
  fileUpload.single('upload'),
  createCategoryController
);
router.get('/getAllCategoryList', getAllCategoryController);
router.get('/getCategoryDetailsById', getCategoryDetailsByIdController);
router.put('/updateCategoryById', fileUpload.single('upload'), updateCategoryByIdController);

module.exports = router;
