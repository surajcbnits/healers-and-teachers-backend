const jwt = require("jsonwebtoken");

const multer  = require('multer')
const path = require('path')

// checking if the user logged in or not
exports.isLogin = (req, res, next) => {
  if (req.header("authorization")) {
    try {
      const token = req.header("authorization").split(" ")[1]
      var decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("decoded : ", decoded);
      req.tokenDecodedData = decoded;
      next();
    } catch (error) {
      console.log('error :>> ', error);
      return res.status(403).json({
        error: "Invalid token!",
      });
    }
  } else {
    return res.status(403).json({
      error: "Authorization token was not provided!",
    });
  }

};



// const upload = multer({ dest: 'static/' })

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + path.extname(file.originalname))
    }
})
  
exports.fileUpload = multer({ storage: storage });
