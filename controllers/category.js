const db = require('../models');
const Category = db.category;
exports.createCategoryController = async (req, res) => {
  // destructor the fields
  const { name, image, description } = req.body;

  // check if the fields are empty
  if (!name || !image || !description) {
    return res.status(400).json({
      message: 'Please fill name,image,description the fields',
    });
  }

  try {
    // const data = await WellnessKeywords.findAndCountAll();

    // console.log("data 666", data);

    // const finalData = data.rows.map((i) => {
    //   return { id: i.dataValues.id, name: i.dataValues.name };
    // });

    // console.log("finalData", finalData);

    /// creating the CategoryKeywords
    const data = await Category.create({
      name,
      image: req?.file?.path,
      description,
    });

    console.log("CategoryKeywords created data : ", data);

    res.status(200).json({ data: 'hit' });
  } catch (error) {
    console.log('error : ', error);
    res.status(500).json({
      message:
        error.message ||
        'Some error occurred while Fetching the WellnessKeywords.',
    });
  }
};
