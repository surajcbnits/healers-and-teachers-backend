const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../models");
const User = db.user;

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
    wellnesskeywords,
    qualification,
    ip
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

  // checking if the user already exist or not
  const foundUser = await User.findOne({ where: { email: email } });
  if (foundUser)
    return res.status(409).json({
      error: "Email id already in use",
    });

    // generating password hash
    bcrypt.hash(password, 10, async function(err, hash) {
      if (err) {
        console.log("err : ", err );
      } else {
        // Store hash in your DB.
        console.log("hash : ", hash);

        let username = firstName + lastName;
        

        let gotUniqueUsername = false
        
        while (!gotUniqueUsername) {

          console.log('username :>> ', username);

          let findUserByUserName = await User.findOne({ where: { username: username } });

          if (findUserByUserName) {
            console.log('get into if :>> ');

            const lastCharacter = username.charAt(username.length-1);
            if (!isNaN(lastCharacter)) {
              
            }
          // console.log('inner username ', username);
          } else {
            gotUniqueUsername = true
          }
        }

        console.log('gotUniqueUsername', gotUniqueUsername)
        console.log('username:>> ', username);

        User.create({
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
          wellnesskeywords,
          qualification,
          ip,
        })
          .then((data) => {
            console.log("data : ", data);
            res.json({ message: `User ${firstName} ${lastName}, created successfully` });
            // res.send(data);
          })
          .catch((err) => {
            console.log("err : ", err);
            // res.status(500).send({
            //   message: err.message || "Some error occurred while creating the Book."
            // });
          });
      }
  });
};

exports.deleteMemberController = (req, res) => {
  console.log("REQ : ", req.body);

  res.json({ message: "Welcome to H&T" });
};

exports.loginController = async(req, res) => {
  console.log("REQ : ", req.body);

    // destructor the fields
    const {
      password,
      email,
    } = req.body;

    if (
      !password ||
      !email 
    ) {
      return res.status(400).json({
        error: "Email and password are required!",
      });
    }

  // getting the user from DB using the email
  const foundUser = await User.findOne({ where: { email: email } });

  // if user doesn't exist
  if (!foundUser) {
    return res.status(400).json({
      message: "User doesn't exist",
    });

  // if user exist
  }else {
    // comparing the password
    bcrypt.compare(password, foundUser.dataValues.password, function(err, result) {
      // if the password is not valid
      if (!result) {
        return res.status(400).json({
          message: "Password doesn't match",
        });
        // if the password is valid
      }else{
        // generating JWT
        const token = jwt.sign(
          {
            id: foundUser.dataValues.id,
            email: foundUser.dataValues.email,
          },
          "secret",
          {
            expiresIn: "7 days",
          }
        );

        res.json({ message: "Logged in successfully", token: token, email: foundUser.dataValues.email });
      }
  });
  }

};

exports.updateMemberController = async(req, res) => {

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
    ip
  } = req.body;

  if (req.tokenDecodedData.email != email) {
    return res.status(403).json({
      error: "user can only update their own data!",
    });
  }

  try {
    await User.update({ 
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
      ip
     }, {
      where: {
        email: email
      }
    });
    res.status(200).json({
      error: "User updated successfully",
    });
  } catch (error) {
    console.log("ERROR : ", error);
    res.status(500).json({
      error: "Something went wrong, while updating the user",
    });
  }
};