const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../models");
const Member = db.member;
const WellnessKeywords = db.wellnessKeywords;
const WellnessMapping = db.wellnessMapping;

exports.registerController = async (req, res) => {
  console.log("REQ : ", req.body);

  // destructor the fields
  const {
    firstName,
    lastName,
    password,
    email,
    city,
    state,
    country,
    phoneno,
    website,
    aboutme,
    descriptionofservices,
    qualification,
    wellnesskeywords,
    ip,
  } = req.body;

  if (
    !firstName ||
    !lastName ||
    !password ||
    !email ||
    !city ||
    !state ||
    !country ||
    !phoneno ||
    !website ||
    !aboutme ||
    !descriptionofservices ||
    !wellnesskeywords ||
    !qualification ||
    !ip
  ) {
    return res.status(400).json({
      error: "Please include all fields",
    });
  }

  try {
    // checking if the user already exist or not
    const foundUser = await Member.findOne({ where: { email: email } });
    if (foundUser)
      return res.status(409).json({
        error: "Email id already in use",
      });

    // generating password hash
    bcrypt.hash(password, 10, async function (err, hash) {
      if (err) {
        console.log("err : ", err);
        res.status(500).json({
          message:
            err.message || "Some error occurred while creating the Member.",
        });
      } else {
        let username = `${firstName}${lastName}`;
        let user = await Member.findOne({ where: { username: username } });
        let number = 0;

        while (user) {
          number++;
          username = `${firstName}${lastName}${number}`;
          user = await Member.findOne({ where: { username: username } });
        }

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

        // creating the member
        const data = await Member.create({
          firstName,
          lastName,
          password: hash,
          username: username,
          email,
          city,
          state,
          country,
          phoneno,
          website,
          aboutme,
          descriptionofservices,
          qualification,
          ip,
        });

        console.log("data : ", data);

        if (wellnessKeywordIds.length) {
          await Promise.all(
            wellnessKeywordIds?.map(async (i) => {
              // doing the mapping between wellness keywords and the member
              await WellnessMapping.create({
                genarelid: data.dataValues.id,
                WellnessKeywordId: i,
                type: "member",
              });
            })
          );
        }
        res.json({
          message: `Member ${firstName} ${lastName}, created successfully`,
        });
      }
    });
  } catch (err) {
    console.log("err : ", err);
    res.status(500).json({
      message: err.message || "Some error occurred while creating the Member.",
    });
  }
};

exports.deleteMemberController = (req, res) => {
  console.log("REQ : ", req.body);

  res.json({ message: "Welcome to H&T" });
};

exports.loginController = async (req, res) => {
  console.log("REQ : ", req.body);

  // destructor the fields
  const { password, email } = req.body;

  if (!password || !email) {
    return res.status(400).json({
      error: "Email and password are required!",
    });
  }

  // getting the user from DB using the email
  const foundUser = await Member.findOne({ where: { email: email } });

  // if user doesn't exist
  if (!foundUser) {
    return res.status(400).json({
      message: "Member doesn't exist",
    });

    // if user exist
  } else {
    console.log("process.env.JWT_SECRET : ", process.env.JWT_SECRET);

    // comparing the password
    bcrypt.compare(
      password,
      foundUser.dataValues.password,
      function (err, result) {
        // if the password is not valid
        if (!result) {
          return res.status(400).json({
            message: "Password doesn't match",
          });
          // if the password is valid
        } else {
          // generating JWT
          const token = jwt.sign(
            {
              id: foundUser.dataValues.id,
              email: foundUser.dataValues.email,
            },
            process.env.JWT_SECRET,
            {
              expiresIn: "7 days",
            }
          );

          res.json({
            message: "Logged in successfully",
            token: token,
            email: foundUser.dataValues.email,
          });
        }
      }
    );
  }
};

exports.updateMemberController = async (req, res) => {
  console.log("req.tokenDecodedData : ", req.tokenDecodedData);

  // destructor the fields
  const {
    firstName,
    lastName,
    email,
    city,
    state,
    country,
    phoneno,
    website,
    aboutme,
    descriptionofservices,
    wellnesskeywords,
    qualification,
    ip,
  } = req.body;

  if (req.tokenDecodedData.email != email) {
    return res.status(403).json({
      error: "user can only update their own data!",
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

    console.log("newWellnessKeywords : ", newWellnessKeywords);
    console.log("newWellnessKeywords length : ", newWellnessKeywords.length);

    // inserting the new wellness keyword
    if (newWellnessKeywords?.length) {
      await Promise.all(
        newWellnessKeywords?.map(async (i) => {
          const data = await WellnessKeywords.create({
            name: i,
          });

          console.log("data 86 :>> ", data);
          console.log("id 86 :>> ", data.dataValues.id);

          // putting the new wellness keyword id to the wellnessKeywordIds list

          wellnessKeywordIds.push(data.dataValues.id);
        })
      );
    }

    const data = await WellnessMapping.findAll({
      where: {
        genarelid: req.tokenDecodedData.id,
        type: "member",
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
            genarelid: req.tokenDecodedData.id,
            WellnessKeywordId: i,
            type: "member",
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
              genarelid: req.tokenDecodedData.id,
              WellnessKeywordId: i,
              type: "member",
            },
          });
        })
      );
    }

    await Member.update(
      {
        firstName,
        lastName,
        email,
        city,
        state,
        country,
        phoneno,
        website,
        aboutme,
        descriptionofservices,
        qualification,
        ip,
      },
      {
        where: {
          email: email,
        },
      }
    );

    res.status(200).json({
      message: "Member updated successfully",
    });
  } catch (error) {
    console.log("ERROR : ", error);
    res.status(500).json({
      error: "Something went wrong, while updating the user",
    });
  }
};
