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

exports.updateCategoryByIdController = async (req, res) => {
  // destructor the query param
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({
      message: "Please send id in query param!",
    });
  }

  // destructor the fields
  const { name, description } = req.body;

  // // check if the fields are empty
  // if (!name || !description) {
  //   return res.status(400).json({
  //     message: "Please fill name,description the fields",
  //   });
  // }

  try {
    // creating the Category
    const data = await Category.update(
      {
        name,
        image: req?.file?.path,
        description,
      },
      {
        where: {
          id: id,
        },
      }
    );

    console.log("CategoryKeywords updated data : ", data);

    res.status(200).json(data);
  } catch (error) {
    console.log("error : ", error);
    res.status(500).json({
      message:
        error.message || "Some error occurred while updating the category.",
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

      console.log(
        "wellnessMappingDataForMember :>> ",
        wellnessMappingDataForMember
      );
      // clearing the data and getting the memberId array
      const memberIds = [];

      wellnessMappingDataForMember.map((i) =>
        i?.map((j) => memberIds.push(j?.dataValues?.genarelid))
      );
      console.log("memberIds :>", memberIds);

      const finalMemberIds = memberIds?.filter((i) => i).filter(onlyUnique);

      console.log("finalMemberIds :>", finalMemberIds);

      //  fetching member details from member id array
      const memberDetails = finalMemberIds?.length
        ? await Promise.all(
            finalMemberIds?.map(async (i) => {
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

      console.log("memberDetails :> ", memberDetails);

      // getting wellnessKeywords for members
      const finalMemberDetails = await Promise.all(
        memberDetails
          .filter((i) => i)
          .map(async (i) => {
            const memberData = i.dataValues;

            const wellnessKeywordsData = [];

            const wellnessMappingData = await WellnessMapping.findAll({
              attributes: ["WellnessKeywordId"],
              where: { genarelid: memberData.id, type: "member" },
            });

            const wellnessKeywordIds = wellnessMappingData.map(
              (i) => i.dataValues.WellnessKeywordId
            );

            if (wellnessKeywordIds.length) {
              await Promise.all(
                wellnessKeywordIds.map(async (i) => {
                  const data = await WellnessKeywords.findOne({
                    attributes: ["name", "id"],
                    where: { id: i },
                  });

                  wellnessKeywordsData.push(data.dataValues);
                })
              );
            }

            memberData.wellnessKeywords = wellnessKeywordsData;

            return memberData;
          })
      );

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

              data.dataValues.memberUserName =
                memberDetails?.dataValues?.username;
              data.dataValues.memberImage = memberDetails?.dataValues?.image;
              data.dataValues.memberFirstName =
                memberDetails?.dataValues?.firstName;
              data.dataValues.memberLastName =
                memberDetails?.dataValues?.lastName;
              data.dataValues.memberTitle = memberDetails?.dataValues?.title;
              return data;
            })
          )
        : [];

      // getting wellnessKeywords for events
      const finalEventDetails = await Promise.all(
        eventDetails
          .filter((i) => i)
          .map(async (i) => {
            const eventData = i.dataValues;

            const wellnessKeywordsData = [];

            const wellnessMappingData = await WellnessMapping.findAll({
              attributes: ["WellnessKeywordId"],
              where: { genarelid: eventData.id, type: "event" },
            });

            const wellnessKeywordIds = wellnessMappingData.map(
              (i) => i.dataValues.WellnessKeywordId
            );

            if (wellnessKeywordIds.length) {
              await Promise.all(
                wellnessKeywordIds.map(async (i) => {
                  const data = await WellnessKeywords.findOne({
                    attributes: ["name", "id"],
                    where: { id: i },
                  });

                  wellnessKeywordsData.push(data.dataValues);
                })
              );
            }

            eventData.wellnessKeywords = wellnessKeywordsData;

            return eventData;
          })
      );

      data.dataValues.wellnessKeywords = wellnesskeywords.filter((i) => i);
      data.dataValues.memberDetails = finalMemberDetails.filter((i) => i);
      data.dataValues.eventDetails = finalEventDetails.filter((i) => i);
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
