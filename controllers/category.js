const db = require('../models');
const Category = db.category;

exports.createCategoryController = async (req, res) => {
  // destructor the fields
  const { name, description } = req.body;

  // check if the fields are empty
  if (!name || !description) {
    return res.status(400).json({
      message: 'Please fill name,description the fields',
    });
  }

  try {
       
    // creating the Category
    const data = await Category.create({
      name,
      image: req?.file?.path,
      description,
    });

    console.log('CategoryKeywords created data : ', data);

    res.status(200).json(data );
  } catch (error) {
    console.log('error : ', error);
    res.status(500).json({
      message:
        error.message ||
        'Some error occurred while Fetching the WellnessKeywords.',
    });
  }
};

exports.getAllCategoryController = async (req, res) => {
  try {
    const data = await Category.findAll({
      attributes: [
        'id',
        'name',
        'image',
        'description',
        'createdAt',
        'updatedAt',
      ],
    });

    res.status(200).json(data);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: err?.message || 'Some error occurred while creating the Member.',
    });
  }
};
