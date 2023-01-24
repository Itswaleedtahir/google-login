const jwt = require("jsonwebtoken");
const { SignUp } = require("../models/index");
const axios = require("axios");

module.exports = {
  google: async (req, res) => {
    // var decoded = jwt_decode(req.body.access_token);
    const result = await axios.get(
      "https://www.googleapis.com/oauth2/v3/userinfo",
      {
        headers: {
          Authorization: `Bearer ${req.body.access_token}`,
        },
      }
    );
      console.log(result.data)
    let user = await SignUp.findOne({ googleId: result.data.sub });
    if (user) {
      const token = jwt.sign(
        {
          id: user.id,
          email: user.email,
          firstname: user.firstname,
          lastname: user.lastname,
          picture:user.picture
        },
        process.env.jwtPrivateKey
      );
      return res.send(token);
    } else {
      const newUser = {
        googleId: result.data.sub,
        email: result.data.email,
        firstname: result.data.given_name,
        lastname: result.data.family_name,
        picture: result.data.picture
      };
      const user = await SignUp.create(newUser);
      const token = jwt.sign(
        {
          id: user.id,
          email: user.email,
          firstname: user.firstname,
          lastname: user.lastname,
          picture:user.picture
        },
        process.env.jwtPrivateKey
      );
      return res.send(token);
    }
  },
};
