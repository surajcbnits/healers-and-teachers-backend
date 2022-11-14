const jwt = require("jsonwebtoken");

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
