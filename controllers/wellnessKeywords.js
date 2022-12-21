const db = require("../models");
const WellnessKeywords = db.wellnessKeywords;

exports.getAllWellnessKeywordsController = async (req, res) => {
  try {
    const data = await WellnessKeywords.findAndCountAll({
      order: [["name", "ASC"]],
    });

    console.log("data 666", data);

    const finalData = data.rows.map((i) => {
      return { id: i.dataValues.id, name: i.dataValues.name };
    });

    console.log("finalData", finalData);

    res.status(200).json({ data: finalData, count: data.count });
  } catch (error) {
    console.log("error : ", error);
    res.status(500).json({
      message:
        error.message ||
        "Some error occurred while Fetching the WellnessKeywords.",
    });
  }
};
