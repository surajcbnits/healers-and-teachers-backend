const db = require("../models");
const MemberServices = db.memberServices;
const Member = db.member;
const WellnessKeywords = db.wellnessKeywords;
const WellnessMapping = db.wellnessMapping;

exports.createMemberServicesController = async (req, res) => {
  console.log("REQ : ", req.body);

  // destructor the fields
  const {
    name,
    description,
    duration,
    feetype,
    slidingscalemin,
    slidingscalemax,
    feepersession,
    wellnesskeywords,
  } = req.body;

  try {
    // all the wellness keyword ids that need the mapping with the new service
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
                err.message ||
                "Some error occurred while creating the Service.",
            });
          });
      });
    }

    // todo: need to add conditions about price (it's in the excel)

    // creating the Events
    const data = await MemberServices.create({
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
      message:
        error.message || "Some error occurred while creating the Service.",
    });
  }
};

exports.updateMemberServicesController = async (req, res) => {
  console.log("REQ : ", req.body);

  // destructor the fields
  const {
    id,
    name,
    description,
    duration,
    feetype,
    slidingscalemin,
    slidingscalemax,
    feepersession,
    wellnesskeywords,
  } = req.body;

  const memberRecord = await MemberServices.findOne({ where: { id: id } });

  if (memberRecord.dataValues.MemberId !== req.tokenDecodedData.id) {
    return res.status(403).json({
      error: "user can only update their own services!",
    });
  }

  try {
    // all the wellness keyword ids that need the mapping with the new user
    const wellnessKeywordIds = wellnesskeywords?.existing?.length
      ? wellnesskeywords?.existing
      : [];

    // new wellness keyword
    const newWellnessKeywords = wellnesskeywords?.new?.length
      ? wellnesskeywords?.new?.map((i) => i.toLowerCase())
      : [];

    // inserting the new wellness keyword
    if (newWellnessKeywords?.length) {
      await Promise.all(
        newWellnessKeywords?.map(async (i) => {
          const data = await WellnessKeywords.create({
            name: i,
          });

          // putting the new wellness keyword id to the wellnessKeywordIds list
          wellnessKeywordIds.push(data.dataValues.id);
        })
      );
    }

    const data = await WellnessMapping.findAll({
      where: {
        genarelid: id,
        type: "service",
      },
    });

    const existingIdsInTheMappingTable = data.map(
      (i) => i.dataValues.WellnessKeywordId
    );
    console.log(
      "existingIdsInTheMappingTable : ",
      existingIdsInTheMappingTable
    );
    console.log("wellnessKeywordIds : ", wellnessKeywordIds);

    // sorting id's for mapping table which one to add and which one to remove

    // new WellnessKeywords that need to added in the mapping table
    let needToAdd = [];

    wellnessKeywordIds.map((i) => {
      if (!existingIdsInTheMappingTable.includes(i)) {
        needToAdd.push(i);
      }
    });

    console.log(
      "new WellnessKeywords that need to added in the mapping table > ",
      needToAdd
    );

    // WellnessKeywords that need to get deleted
    let needToDelete = [];

    existingIdsInTheMappingTable.map((i) => {
      if (!wellnessKeywordIds.includes(i)) {
        needToDelete.push(i);
      }
    });

    console.log("WellnessKeywords that need to get deleted > ", needToDelete);

    if (needToAdd?.length) {
      await Promise.all(
        needToAdd?.map(async (i) => {
          // doing the mapping between wellness keywords and the member
          await WellnessMapping.create({
            genarelid: id,
            WellnessKeywordId: i,
            type: "service",
          });
        })
      );
    }

    if (needToDelete?.length) {
      await Promise.all(
        needToDelete?.map(async (i) => {
          // deleting the records that are not needed anymore
          await WellnessMapping.destroy({
            where: {
              genarelid: id,
              WellnessKeywordId: i,
              type: "service",
            },
          });
        })
      );
    }

    await MemberServices.update(
      {
        name,
        description,
        duration,
        feetype,
        slidingscalemin,
        slidingscalemax,
        feepersession,
      },
      {
        where: {
          id: id,
        },
      }
    );

    res.status(200).json({
      message: "Service updated successfully",
    });
  } catch (error) {
    console.log("ERROR : ", error);
    res.status(500).json({
      error: "Something went wrong, while updating the service",
    });
  }
};

exports.getMemberServicesByUserController = async (req, res) => {
  const { username } = req.query;

  if (!username) {
    return res.status(400).json({
      error: "Member's username is mandatory",
    });
  }

  try {
    const memberDetails = await Member.findOne({
      where: { username: username },
    });

    const data = await MemberServices.findAll({
      where: {
        MemberId: memberDetails.dataValues.id,
      },
    });


    const finalData = await Promise.all(
      data.map(async (i) => {
        const eventsData = i.dataValues;

        const wellnessKeywordsData = [];

        const wellnessMappingData = await WellnessMapping.findAll({
          attributes: ["WellnessKeywordId"],
          where: { genarelid: eventsData.id, type: "service" },
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

        eventsData.wellnessKeywords = wellnessKeywordsData;

        return eventsData;
      })
    );

    console.log("finalData", finalData);

    res.status(200).json({ data: finalData });
  } catch (error) {
    console.log("error : ", error);
    res.status(500).json({
      message:
        error.message || "Some error occurred while Fetching the Services.",
    });
  }
};
