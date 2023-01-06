const db = require("../models");
const { onlyUnique } = require("../utils");
const Category = db.category;
const WellnessKeywords = db.wellnessKeywords;
const Member = db.member;
const WellnessMapping = db.wellnessMapping;
const MemberEvents = db.memberEvents;

exports.createCategoryController = async (req, res) => {
  // destructor the fields
  const { name, description } = req.body;

  // check if the fields are empty
  if (!name || !description) {
    return res.status(400).json({
      message: "Please fill name,description the fields",
    });
  }

  try {
    // creating the Category
    const data = await Category.create({
      name,
      image: req?.file?.path,
      description,
    });

    console.log("CategoryKeywords created data : ", data);

    res.status(200).json(data);
  } catch (error) {
    console.log("error : ", error);
    res.status(500).json({
      message:
        error.message ||
        "Some error occurred while Fetching the WellnessKeywords.",
    });
  }
};

exports.getAllCategoryController = async (req, res) => {
  try {
    const data = await Category.findAll({
      attributes: [
        "id",
        "name",
        "image",
        "description",
        "createdAt",
        "updatedAt",
      ],
    });

    res.status(200).json(data);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message:
        err?.message || "Some error occurred while fetching the Categories.",
    });
  }
};

exports.getCategoryDetailsByIdController = async (req, res) => {
  const { id } = req.query;

  if (!id) {
    res.status(500).json("Id is mandatory");
  }

  try {
    const data = await Category.findOne({
      where: { id: id },
      attributes: [
        "id",
        "name",
        "image",
        "description",
        "createdAt",
        "updatedAt",
      ],
    });

    if (data?.dataValues?.id) {
      // fetching the wellnessKeywords that is attached to the category
      const wellnessKeywordData = await WellnessKeywords.findAll({
        where: { CategoryId: data.dataValues.id },
      });
      console.log("wellnessKeywordData", wellnessKeywordData);

      // clear the wellnessKeywords data with the name and id
      const wellnesskeywords = wellnessKeywordData.length
        ? wellnessKeywordData.map((i) => {
            return { id: i.dataValues.id, name: i.dataValues.name };
          })
        : [];

      // getting all the members that is being mapped to the current wellnesskeywords
      const wellnessMappingDataForMember = await Promise.all(
        wellnesskeywords.map(async (i) => {
          console.log("i.id : ", i.id);
          const id = await WellnessMapping.findAll({
            where: { WellnessKeywordId: i.id, type: "member" },
          });

          return id;
        })
      );
      // clearing the data and getting the memberId array
      const memberIds = wellnessMappingDataForMember
        .map((i) => i[0]?.dataValues?.genarelid)
        .filter((i) => i)
        .filter(onlyUnique);

        console.log('memberIds :>', memberIds)

      //  fetching member details from member id array
      const memberDetails = memberIds?.length
        ? await Promise.all(
            memberIds?.map(async (i) => {
              const data = await Member.findOne({
                attributes: [
                  "id",
                  "firstName",
                  "lastName",
                  "username",
                  "email",
                  "city",
                  "state",
                  "country",
                  "phoneno",
                  "website",
                  "aboutme",
                  "title",
                  "qualification",
                  "facebook",
                  "instagram",
                  "twitter",
                  "image",
                  "physicaladdress",
                  "ip",
                  "virtualsessions",
                ],
                where: { id: i, accountstatus: "active" },
              });
              return data;
            })
          )
        : [];

        console.log('memberDetails :> ', memberDetails)

      // getting all the events that is being mapped to the current wellnesskeywords
      const wellnessMappingDataForEvents = await Promise.all(
        wellnesskeywords.map(async (i) => {
          console.log("i.id : ", i.id);
          const id = await WellnessMapping.findAll({
            where: { WellnessKeywordId: i.id, type: "event" },
          });
          return id;
        })
      );
      // clearing the data and getting the eventId array
      const eventIds = wellnessMappingDataForEvents
        ?.map((i) => i[0]?.dataValues?.genarelid)
        .filter((i) => i)
        .filter(onlyUnique);

      //  fetching event details from event id array
      const eventDetails = eventIds?.length
        ? await Promise.all(
            eventIds?.map(async (i) => {
              const data = await MemberEvents.findOne({
                where: { id: i, eventstatus: "active" },
              });

              const memberDetails = await Member.findOne({
                where: { id: data.dataValues.MemberId },
              });
      
              data.dataValues.memberUserName = memberDetails?.dataValues?.username;
              data.dataValues.memberImage = memberDetails?.dataValues?.image;
              data.dataValues.memberFirstName = memberDetails?.dataValues?.firstName;
              data.dataValues.memberLastName = memberDetails?.dataValues?.lastName;
              return data;
            })
          )
        : [];

      data.dataValues.wellnesskeywords = wellnesskeywords.filter((i) => i);
      data.dataValues.memberDetails = memberDetails.filter((i) => i);
      data.dataValues.eventDetails = eventDetails.filter((i) => i);
    }

    console.log("data : ", data);

    res.status(200).json(data);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: err?.message || "Some error occurred while creating the Member.",
    });
  }
};
