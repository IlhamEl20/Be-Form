import User from "../models/User.js";
import emailExist from "../libraries/emailExist.js";
import bcrypt from "bcrypt";
import Jwt from "jsonwebtoken";
import dotenv from "dotenv";
const env = dotenv.config().parsed;

const generateAccessToken = async (payload) => {
  return Jwt.sign(payload, env.JWT_ACCESS_TOKEN_SECRET, {
    expiresIn: env.JWT_ACCESS_TOKEN_EXP_TIME,
  });
};
const generateRefreshToken = async (payload) => {
  return Jwt.sign(payload, env.JWT_REFRESH_TOKEN_SECRET, {
    expiresIn: env.JWT_REFRESH_TOKEN_EXP_TIME,
  });
};

class AuthController {
  async register(req, res) {
    try {
      if (!req.body.fullname) {
        throw { code: 400, message: "FULLNAME_IS_REQUIRED" };
      }
      if (!req.body.email) {
        throw { code: 400, message: "EMAIL_IS_REQUIRED" };
      }
      if (!req.body.password) {
        throw { code: 400, message: "PASSWORD_IS_REQUIRED" };
      }
      if (req.body.password.length < 6) {
        throw { code: 400, message: "PASSOWRD_KURNAG_DARI_6" };
      }
      const isemailExist = await emailExist(req.body.email);
      if (isemailExist) {
        throw { code: 409, message: "EMAIL_ALREADY_EXIST" };
      }
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(req.body.password, salt);

      const user = await User.create({
        fullname: req.body.fullname,
        email: req.body.email,
        password: hash,
      });
      if (!user) {
        throw { code: 500, message: "USER_REGIS_FAILD" };
      }

      return res.status(200).json({
        status: true,
        message: "USER_REGIS_SUCCESS",
        user,
      });
    } catch (err) {
      return res.status(err.code || 500).json({
        status: false,
        message: err.message,
      });
    }
  }
  async login(req, res) {
    try {
      if (!req.body.email) {
        throw { code: 400, message: "EMAIL_IS_REQUIRED" };
      }
      if (!req.body.password) {
        throw { code: 400, message: "PASSWORD_IS_REQUIRED" };
      }
      const user = await User.findOne({ email: req.body.email });
      if (!user) {
        throw { code: 404, message: "USER_NOT_FOUND" };
      }
      const isPasswordValid = await bcrypt.compareSync(
        req.body.password,
        user.password
      );
      if (!isPasswordValid) {
        throw { code: 400, message: "PASSWORD_INVALID" };
      }
      let payload = { id: user.id };

      const accessToken = await generateAccessToken(payload);
      const refreshToken = await generateRefreshToken(payload);
      return res.status(200).json({
        status: true,
        message: "USER_LOGIN_SUCCESS",
        fullname: user.fullname,
        accessToken,
        refreshToken,
      });
    } catch (err) {
      return res.status(err.code || 500).json({
        status: false,
        message: err.message,
      });
    }
  }
  async refreshToken(req, res) {
    try {
      if (!req.body.refreshToken) {
        throw { code: 400, message: "REFRESH_TOKEN_IS_REQUIRED" };
      }
      //veri refesh token
      const verify = await Jwt.verify(
        req.body.refreshToken,
        env.JWT_REFRESH_TOKEN_SECRET
      );
      let payload = { id: verify.id };
      const accessToken = await generateAccessToken(payload);
      const refreshToken = await generateRefreshToken(payload);
      return res.status(200).json({
        status: true,
        message: "REFRESH_TOKEN_SUCCESS",
        accessToken,
        refreshToken,
      });
    } catch (err) {
      if (err.message == "jwt expired") {
        err.message = "REFRESH_TOKEN_EXP";
      } else if (
        err.message == "invalid signature" ||
        err.message == "jwt malformed" ||
        err.message == "invalid token" ||
        err.message == "jwt must be provided"
      ) {
        err.message = "INVALID_REFRESH_TOKEN";
      }
      return res.status(err.code || 500).json({
        status: false,
        message: err.message,
      });
    }
  }
}
export default new AuthController();
