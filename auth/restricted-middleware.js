const jwt = require("jsonwebtoken");
const secrets = require("../data/secrets.js");

module.exports = (req, res, next) => {
  const [authType, token] = req.headers.authorization.split(" ");
  console.log("token", token);

  if (token) {
    jwt.verify(token, secrets.jwtSecret, (err, decodedToken) => {
      if (err) {
        res.status(401).json({ message: "please login" });
      } else {
        req.decodedJwt = decodedToken;
        next();
      }
    });
  } else {
    res.status(401).json({ you: "no admittance)" });
  }
};
