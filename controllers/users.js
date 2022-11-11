const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../models");
const Users = db.users;

exports.createUserController = (req, res) => {
  console.log("REQ : ", req.body);

  // destructor the fields
  const { firstName, lastName } = req.body;

  if (!firstName || !lastName) {
    return res.status(400).json({
      error: "Please include all fields",
    });
  }

  Users.create({
    // id:2,
    firstName,
    lastName,
  })
    .then((data) => {
      console.log("data : ", data);
      // res.send(data);
    })
    .catch((err) => {
      console.log("err : ", err);
      // res.status(500).send({
      //   message: err.message || "Some error occurred while creating the Book."
      // });
    });
  res.json({ message: "Welcome to H&T" });
};

exports.deleteUserController = (req, res) => {
  console.log("REQ : ", req.body);

  res.json({ message: "Welcome to H&T" });
};

exports.loginController = (req, res) => {
  console.log("REQ : ", req.body);

  res.json({ message: "Welcome to H&T" });
};

exports.registerController = (req, res) => {
  console.log("REQ : ", req.body);

  res.json({ message: "Welcome to H&T" });
};

exports.create = async(req, res) => {
  try {
    if (!req.body) {
      return res.status(400).send({
        message: "Please Fill all details",
      });
    }

    const foundUser = await Users.findOne({ where:{ "email" : req.body.email }});
    if(foundUser) return res.status(409).json({
      error: "User already exist"
    });

    var salt = bcrypt.genSaltSync(10);
    var hash = bcrypt.hashSync(req.body.password, salt);
    const user = new User({
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email: req.body.email,
        address: req.body.address,
        gender: req.body.gender,
        password: hash,
        salt: salt,
    });

    user
    .save()
    .then((result) => {
      console.log(result); // info log
      res.status(201).json({
        message: "User sucessfully created",
      });
    })
    .catch((err) => {
      console.log(err); // to be modified
      res.status(500).json({
        error: err,
      });
    });
  } catch (error) {
    res.status(500).json({
      error
    });
  }

}


exports.login = (req, res) => {
    User.find({ email: req.body.email })
      .exec()
      .then((user) => {
        if (user.length < 1) {
          return res.status(400).json({
            message: "User doesn't exist",
          });
        } else if (!bcrypt.compareSync(req.body.password, user[0].password)) {
          return res.status(400).json({
            message: "Wrong Password",
          });
        }
        const token = jwt.sign(
          {
            id: user[0]._id,
            email: user[0].email,
          },
          "R6ji0xEwESbQ8oTrGf4MFvxdmDgw2NB8",
          {
            expiresIn: "7 days",
          }
        );
        return res.status(200).json({
          message: "Login successful",
          userDetails: user[0]._id,
          token: token,
          first_name: user[0].first_name
        });
    })
      .catch((err) => {
        console.log(err);
        res.status(500).json({
          error: err,
        });
    });
};

exports.viewProfile = async(req, res) => {
  try {
    if(!req.user) return res.sendStatus(401)
    const foundUser = await User.findOne({ "_id" : req.user.id, "email": req.user.email });
    console.log(foundUser)
    if(foundUser) return res.status(200).json({
      first_name: foundUser.first_name,
      last_name: foundUser.last_name,
      email: foundUser.email,
      address: foundUser.address,
      gender: foundUser.gender,
      avatar: foundUser.avatar,
    });
    else return res.sendStatus(404)

  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: error,
    });
  }
}

exports.editProfile = async(req, res) => {
  try {
    let updatedUser
    if(req.file){
      updatedUser = await User.findOneAndUpdate(
        { "_id" : req.user.id, "email": req.user.email },
        {
          first_name: req.body.first_name,
          last_name: req.body.last_name,
          email: req.body.email,
          address: req.body.address,
          gender: req.body.gender,
          avatar: req.file.filename
        }
      )
    } else {
      updatedUser = await User.findOneAndUpdate(
        { "_id" : req.user.id, "email": req.user.email },
        {
          first_name: req.body.first_name,
          last_name: req.body.last_name,
          email: req.body.email,
          address: req.body.address,
          gender: req.body.gender,
        }
      )
    }
    if(updatedUser) res.sendStatus(204)
    else res.sendStatus(400)
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: error,
    });
  }
}