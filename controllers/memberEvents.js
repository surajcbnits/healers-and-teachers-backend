const db = require("../models");
const MemberEvents = db.memberEvents;
const Member = db.member;
const WellnessKeywords = db.wellnessKeywords;
const WellnessMapping = db.wellnessMapping;

exports.createMemberEventsController = async (req, res) => {
  console.log("REQ : ", req.body);

  // destructor the fields
  const {
    name,
    description,
    startdatetime,
    enddatetime,
    type,
    city,
    state,
    country,
    link,
    feetype,
    slidingscalemin,
    slidingscalemax,
    feepersession,
    recurring,
    recurringschedule,
  } = req.body;

  //this wellnesskeywords are coming as string we have to parse it
  const wellnesskeywords = JSON.parse(req.body.wellnesskeywords);

  if (wellnesskeywords?.existing?.length + wellnesskeywords?.new?.length > 5) {
    return res.status(500).json({
      message: "Maximum limit of wellnesskeywords is 5!",
    });
  }

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
      await Promise.all(
        newWellnessKeywords?.map(async (i) => {
          const data = await WellnessKeywords.create({
            name: String(i).toLowerCase(),
          });
          // putting the new wellness keyword id to the wellnessKeywordIds list
          wellnessKeywordIds.push(data.dataValues.id);
        })
      );
    }

    // todo: need to add conditions about price (it's in the excel)

    // creating the Events
    const data = await MemberEvents.create({
      name,
      description,
      startdatetime,
      enddatetime,
      type,
      city,
      state,
      country,
      link,
      feetype,
      slidingscalemin,
      slidingscalemax,
      feepersession,
      recurring,
      recurringschedule,
      MemberId: req.tokenDecodedData.id,
      image: req?.file?.path,
    });

    if (wellnessKeywordIds.length) {
      await Promise.all(
        wellnessKeywordIds?.map(async (i) => {
          // doing the mapping between wellness keywords and the member
          await WellnessMapping.create({
            genarelid: data.dataValues.id,
            WellnessKeywordId: i,
            type: "event",
          });
        })
      );
    }

    res.status(201).json({ message: "Event created successfully" });
  } catch (error) {
    console.log("error : ", error);
    res.status(500).json({
      message: error.message || "Some error occurred while creating the Event.",
    });
  }
};

exports.updateMemberEventsController = async (req, res) => {
  console.log("REQ : ", req.body);

  // destructor the fields
  const {
    id,
    name,
    description,
    startdatetime,
    enddatetime,
    type,
    city,
    state,
    country,
    link,
    feetype,
    slidingscalemin,
    slidingscalemax,
    feepersession,
    recurring,
    recurringschedule,
  } = req.body;

  //this wellnesskeywords are coming as string we have to parse it
  const wellnesskeywords = JSON.parse(req.body.wellnesskeywords);

  if (wellnesskeywords?.existing?.length + wellnesskeywords?.new?.length > 5) {
    return res.status(500).json({
      message: "Maximum limit of wellnesskeywords is 5!",
    });
  }

  const eventRecord = await MemberEvents.findOne({
    where: { id: id, eventstatus: "active" },
  });

  // if event doesn't exist
  if (!eventRecord) {
    return res.status(400).json({
      message: "Event doesn't exist",
    });
  }

  if (eventRecord.dataValues.MemberId !== req.tokenDecodedData.id) {
    return res.status(403).json({
      error: "user can only update their own event!",
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
            name: String(i).toLowerCase(),
          });

          // putting the new wellness keyword id to the wellnessKeywordIds list
          wellnessKeywordIds.push(data.dataValues.id);
        })
      );
    }

    const data = await WellnessMapping.findAll({
      where: {
        genarelid: id,
        type: "event",
      },
    });

    const existingIdsInTheMappingTable = data.map(
      (i) => i.dataValues.WellnessKeywordId
    );
    console.log("existingIdsInTheMappingTable: ", existingIdsInTheMappingTable);
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
            type: "event",
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
              type: "event",
            },
          });
        })
      );
    }

    await MemberEvents.update(
      {
        name,
        description,
        startdatetime,
        enddatetime,
        type,
        city,
        state,
        country,
        link,
        feetype,
        slidingscalemin,
        slidingscalemax,
        feepersession,
        recurring,
        recurringschedule,
        image: req?.file?.path,
      },
      {
        where: {
          id: id,
        },
      }
    );

    res.status(200).json({
      message: "Event updated successfully",
    });
  } catch (error) {
    console.log("ERROR : ", error);
    res.status(500).json({
      error: "Something went wrong, while updating the event",
    });
  }
};

exports.getMemberEventsByUserController = async (req, res) => {
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

    const data = await MemberEvents.findAll({
      where: {
        MemberId: memberDetails.dataValues.id,
        eventstatus: "active",
      },
    });

    const finalData = await Promise.all(
      data.map(async (i) => {
        const eventsData = i.dataValues;

        const wellnessKeywordsData = [];

        const wellnessMappingData = await WellnessMapping.findAll({
          attributes: ["WellnessKeywordId"],
          where: { genarelid: eventsData.id, type: "event" },
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
        eventsData.memberUserName = memberDetails?.dataValues?.username;
        eventsData.memberImage = memberDetails?.dataValues?.image;
        eventsData.memberFirstName = memberDetails?.dataValues?.firstName;
        eventsData.memberLastName = memberDetails?.dataValues?.lastName;

        return eventsData;
      })
    );

    console.log("finalData", finalData);

    res.status(200).json({ data: finalData });
  } catch (error) {
    console.log("error : ", error);
    res.status(500).json({
      message:
        error.message || "Some error occurred while Fetching the Events.",
    });
  }
};

exports.deleteMemberEventsController = async (req, res) => {
  const { eventId } = req.query;

  const eventRecord = await MemberEvents.findOne({
    where: { id: eventId, eventstatus: "active" },
  });

  // if event doesn't exist
  if (!eventRecord) {
    return res.status(400).json({
      message: "Event doesn't exist",
    });
  }

  if (eventRecord.dataValues.MemberId !== req.tokenDecodedData.id) {
    return res.status(403).json({
      error: "user can only delete their own event!",
    });
  }

  try {
    await MemberEvents.update(
      {
        eventstatus: "inactive",
      },
      {
        where: {
          id: eventId,
        },
      }
    );

    res.status(200).json({
      message: "Event successfully deleted",
    });
  } catch (error) {
    console.log("error : ", error);
    res.status(500).json({
      message: error.message || "Some error occurred while Deleting the Event.",
    });
  }
};

exports.getAllMemberEventsController = async (req, res) => {
  const { limit, offset, sort, wellnessKeywordIds } = req.query;

  console.log("limit", limit);
  console.log("offset", offset);
  console.log("wellnessKeywordIds", wellnessKeywordIds);
  try {
    const eventIds = wellnessKeywordIds?.length
      ? (
          await WellnessMapping.findAll({
            attributes: ["genarelid"],
            where: {
              WellnessKeywordId: JSON.parse(wellnessKeywordIds),
              type: "event",
            },
          })
        )
          .map((i) => i.dataValues.genarelid)
          .filter(onlyUnique)
      : [];

    console.log("eventIds :>> ", eventIds);

    const data = eventIds?.length
      ? await MemberEvents.findAndCountAll({
          offset: Number(offset ?? 0),
          limit: Number(limit ?? 10),
          where: {
            id: eventIds,
            eventstatus: "active",
          },
          order: [["firstName", sort === "DESC" ? "DESC" : "ASC"]],
        })
      : await MemberEvents.findAndCountAll({
          offset: Number(offset ?? 0),
          limit: Number(limit ?? 10),
          order: [["firstName", sort === "DESC" ? "DESC" : "ASC"]],
        });
    console.log("data 123", data);

    const finalData = await Promise.all(
      data.rows.map(async (i) => {
        const eventsData = i.dataValues;

        const wellnessKeywordsData = [];

        const wellnessMappingData = await WellnessMapping.findAll({
          attributes: ["WellnessKeywordId"],
          where: { genarelid: eventsData.id, type: "event" },
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

        const memberDetails = await Member.findOne({
          where: { id: eventsData.MemberId },
        });

        eventsData.memberUserName = memberDetails?.dataValues?.username;
        eventsData.memberImage = memberDetails?.dataValues?.image;
        eventsData.memberFirstName = memberDetails?.dataValues?.firstName;
        eventsData.memberLastName = memberDetails?.dataValues?.lastName;

        eventsData.wellnessKeywords = wellnessKeywordsData;

        return eventsData;
      })
    );

    console.log("finalData", finalData);

    res.status(200).json({
      count: data.count,
      currentCount: finalData.length,
      data: finalData,
    });
    // res.status(200).json(data);
  } catch (error) {
    console.log("error : ", error);
    res.status(500).json({
      message:
        error.message || "Some error occurred while Fetching all Events.",
    });
  }
};
