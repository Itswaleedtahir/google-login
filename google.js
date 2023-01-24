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
    let user = await SignUp.findOne({
      where: {googleId: result.data.sub}
     });
    if (0) {
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
      let newUser = {
        googleId: result.data.sub,
        email: result.data.email,
        firstname: result.data.given_name,
        lastname: result.data.family_name,
        picture: result.data.picture
      };
      console.log(newUser.picture)
      const User = await SignUp.create(newUser);

      const token = jwt.sign(
        {
          id: User.id,
          email: User.email,
          firstname: User.firstname,
          lastname: User.lastname,
          picture:User.picture
        },
        process.env.jwtPrivateKey
      );
      console.log(User.picture)
      return res.send(token);
    }
  },
};
