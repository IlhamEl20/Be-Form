import Jwt from "jsonwebtoken";
import dotenv from "dotenv";
import UserAccess from "../models/UserAccess.js";

const env = dotenv.config().parsed;

const jwtAuth = () => {
  return async function (req, res, next) {
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
      if (err.message == "jwt expired") {
        err = "TOKEN_EXPIRED";
      } else {
        err = err.message || "TOKEN_IS_NOT_VALID";
      }

      return res.status(401).json({
        success: false,
        message: err,
      });
    }
  };
};
export default jwtAuth;
