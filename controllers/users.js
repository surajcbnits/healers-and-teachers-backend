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
      error: "User already exist",
    });

    // generating password hash
    bcrypt.hash(password, 10, function(err, hash) {
      // Store hash in your password DB.
      if (err) {
        console.log("err : ", err );
      } else {
        console.log("hash : ", hash);
        User.create({
          firstName,
          lastName,
          password: hash,
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

exports.deleteUserController = (req, res) => {
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
          "secrete",
          {
            expiresIn: "7 days",
          }
        );

        res.json({ message: "Logged in successfully", token: token, email: foundUser.dataValues.email });
      }
  });
  }

};

exports.createUserController = (req, res) => {
  console.log("REQ : ", req.body);

  res.json({ message: "Welcome to H&T" });
};