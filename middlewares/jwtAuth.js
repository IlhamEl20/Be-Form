import Jwt from "jsonwebtoken";
import dotenv from "dotenv";

const env = dotenv.config().parsed;

const jwtAuth = () => {
  return async (req, res, next) => {
    try {
      if (!req.headers.authorization) {
        throw { code: 401, message: "UNAUTHORIZED" };
      }
      const token = req.headers.authorization.split(" ")[1]; //Bearer <token>
      const verify = Jwt.verify(token, process.env.JWT_ACCESS_TOKEN_SECRET);
      req.jwt = verify; // req jwt data user login
      next();
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
