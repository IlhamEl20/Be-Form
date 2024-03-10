import User from "../models/User.js";
import UserAccess from "../models/UserAccess.js";
import Mongoose from "mongoose";
import jwt from "jsonwebtoken";

class ProfileController {
  async userAccess(req, res) {
    try {
      const userAccess = await UserAccess.find({ userId: req.jwt.userId });

      return res.status(200).json({
        status: true,
        message: "USER_ACCESS_SUCCESS",
        total: userAccess.length,
        userAccess,
      });
    } catch (error) {
      if (error.code > 500) {
        error.code = 400;
      }
      return res.status(error.code || 500).json({
        status: false,
        message: error.message,
      });
    }
  }

  async logLogin(req, res) {
    try {
      const userAccess = await UserAccess.find({
        userId: req.jwt.userId,
        type: "login",
        statusLogin: true,
      });
      console.log(req.jwt.userId);
      return res.status(200).json({
        status: true,
        message: "USER_ACCESS_SUCCESS",
        total: userAccess.length,
        userAccess,
      });
    } catch (error) {
      if (error.code > 500) {
        error.code = 400;
      }
      return res.status(error.code || 500).json({
        status: false,
        message: error.message,
      });
    }
  }

  async remoteLogout(req, res) {
    try {
      //update status login to false
      const userAccess = await UserAccess.findOneAndUpdate(
        {
          _id: req.params.userAccessId,
          statusLogin: true,
        },
        {
          statusToken: false,
          statusLogin: false,
        },
        { new: true }
      );

      //check is UserAccessId active not found
      if (!userAccess) {
        throw { message: "jwt expired" };
      }

      //update status login to false
      const setTokenExpired = await UserAccess.updateMany(
        {
          sessionId: userAccess.sessionId,
        },
        {
          statusToken: false,
        },
        { new: true }
      );

      return res.status(200).json({
        status: true,
        message: "LOGOUT_SUCCESS",
      });
    } catch (error) {
      if (error.message == "jwt expired") {
        error.code = 401;
        error.message = "ACCESS_TOKEN_EXPIRED";
      } else if (errorJwt.includes(error.message)) {
        error.message = "INVALID_ACCESS_TOKEN";
      }

      return res.status(error.code || 500).json({
        status: false,
        message: error.message,
      });
    }
  }
}

export default new ProfileController();
