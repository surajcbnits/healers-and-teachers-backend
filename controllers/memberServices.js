const db = require("../models");
const MemberServices = db.memberServices;
const WellnessKeywords = db.wellnessKeywords;
const WellnessMapping = db.wellnessMapping;

exports.createMemberServicesController = async (req, res) => {
  console.log("REQ : ", req.body);

  // destructor the fields
  const {
    email,
    name,
    description,
    duration,
    feetype,
    slidingscalemin,
    slidingscalemax,
    feepersession,
    wellnesskeywords
  } = req.body;

  try {
    // all the wellness keyword ids that need the mapping with the new event
    const wellnessKeywordIds = wellnesskeywords?.existing?.length
      ? wellnesskeywords?.existing
      : [];

    // new wellness keyword
    const newWellnessKeywords = wellnesskeywords?.new?.length
      ? wellnesskeywords?.new?.map((i) => i.toLowerCase())
      : [];

    // inserting the new wellness keyword
    if (newWellnessKeywords?.length) {
      newWellnessKeywords?.map(async (i) => {
        WellnessKeywords.create({
          name: i,
        })
          .then((data) => {
            // putting the new wellness keyword id to the wellnessKeywordIds list
            wellnessKeywordIds.push(data.dataValues.id);
          })
          .catch((err) => {
            console.log(err);
            res.status(500).json({
              message:
                err.message || "Some error occurred while creating the Event.",
            });
          });
      });
    }

    // todo: need to add conditions about price (it's in the excel)

    // creating the Events
    const data = await MemberServices.create({
      email,
      name,
      description,
      duration,
      feetype,
      slidingscalemin,
      slidingscalemax,
      feepersession,
      MemberId: req.tokenDecodedData.id,
    });

    if (wellnessKeywordIds.length) {
      await Promise.all(
        wellnessKeywordIds?.map(async (i) => {
          // doing the mapping between wellness keywords and the member
          await WellnessMapping.create({
            genarelid: data.dataValues.id,
            WellnessKeywordId: i,
            type: "service",
          });
        })
      );
    }

    res.status(201).json({ message: "Service created successfully" });
  } catch (error) {
    console.log("error : ", error);
    res.status(500).json({
      message: error.message || "Some error occurred while creating the Event.",
    });
  }
};
