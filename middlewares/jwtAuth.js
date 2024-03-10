import Jwt from "jsonwebtoken";
import dotenv from "dotenv";
import UserAccess from "../models/UserAccess.js";

const env = dotenv.config().parsed;

const jwtAuth = () => {
  return async (req, res, next) => {
    try {
      if (req.headers.authorization) {
        const token = req.headers.authorization.split(" ")[1];

        const jwtVerified = Jwt.verify(token, env.JWT_ACCESS_TOKEN_SECRET);

        if (jwtVerified) {
          //get UserAccess
          const userAccess = await UserAccess.findOne({
            _id: jwtVerified._id,
            statusToken: true,
          });
          console.log(userAccess);
          if (!userAccess) {
            throw { message: "TOKEN_IS_NOT_VALID" };
          }

          if (userAccess.userAgent != req.headers["user-agent"]) {
            throw { message: "TOKEN_FROM_OTHER_DEVICES" };
          }

          //add user_id to jwt, for backend only
          jwtVerified.userId = userAccess.userId;

          req.jwt = jwtVerified;
          next();
        }
      } else {
        throw { message: "TOKEN_REQUIRED" };
      }
    } catch (err) {
      const errJwt = [
        "invalid signature",
        "jwt malformed",
        "invalid token",
        "jwt must be provided",
      ];
      if (err.message == "jwt expired") {
        err.message = "ACCESS_TOKEN_EXP";
        err.code = 401;
      } else if (errJwt.includes(err.message)) {
        err.message = "INVALID_REFRESH_TOKEN";
      }
      return res.status(err.code || 500).json({
        status: false,
        message: err.message,
      });
    }
  };
};
export default jwtAuth;
