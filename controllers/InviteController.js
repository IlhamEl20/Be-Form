import mongoose, { deleteModel } from "mongoose";
import Form from "../models/Form.js";
import User from "../models/User.js";
class InviteController {
  async index(req, res) {
    try {
      if (!req.params.id) {
        throw { code: 400, message: "REQUIRE_FORM_ID" };
      }

      if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        throw { code: 400, message: "INVALID_ID" };
      }
      // cek email yang di invite benar
      const form = await Form.findOne({
        _id: req.params.id,
        userId: req.jwt.id,
      }).select("invites");
      if (!form) {
        throw { code: 400, message: "INVITES_NOT_FOUND" };
      }

      return res.status(200).json({
        status: true,
        message: "INVITES_FOUND",
        invites: form.invites,
      });
    } catch (err) {
      return res.status(err.code || 500).json({
        status: false,
        message: err.message,
      });
    }
  }
  async store(req, res) {
    try {
      if (!req.params.id) {
        throw { code: 400, message: "REQUIRE_FORM_ID" };
      }
      if (!req.body.email) {
        throw { code: 400, message: "REQUIRE_EMAIL" };
      }
      if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        throw { code: 400, message: "INVALID_ID" };
      }
      // Cek invite diri sendiri
      const user = await User.findOne({
        _id: req.jwt.id,
        email: req.body.email,
      });
      if (user) {
        throw { code: 400, message: "CANT_INVITE_YOURSELF" };
      }
      //email sdh di invite
      const emailInvited = await Form.findOne({
        _id: req.params.id,
        userId: req.jwt.id,
        invites: { $in: req.body.email },
      });
      if (emailInvited) {
        throw { code: 400, message: "EMAIL_ALREADY_INVITED" };
      }
      //ek Email
      if (/[a-z0-9]+@[a-z]+.[a-z]{2,3}/.test(req.body.email) === false) {
        throw { code: 400, message: "INVALID_EMAIL" };
      }
      const invites = await Form.findOneAndUpdate(
        { _id: req.params.id, userId: req.jwt.id },
        { $push: { invites: req.body.email } },
        { new: true }
      );
      if (!invites) {
        throw { code: 400, message: "INVITE_FAILED" };
      }

      return res.status(200).json({
        status: true,
        message: "INVITE_SUCCESS",
        email: req.body.email,
      });
    } catch (err) {
      console.log(err);
      return res.status(err.code || 500).json({
        status: false,
        message: err.message,
      });
    }
  }
  async destroy(req, res) {
    try {
      if (!req.params.id) {
        throw { code: 400, message: "REQUIRE_FORM_ID" };
      }
      if (!req.body.email) {
        throw { code: 400, message: "REQUIRE_EMAIL" };
      }
      if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        throw { code: 400, message: "INVALID_ID" };
      }
      // cek email yang di invite benar
      const emailExist = await Form.findOne({
        _id: req.params.id,
        userId: req.jwt.id,
        invites: { $in: req.body.email },
      });
      if (!emailExist) {
        throw { code: 400, message: "EMAIL_NOT_FOUND" };
      }
      const invites = await Form.findOneAndUpdate(
        { _id: req.params.id, userId: req.jwt.id },
        { $pull: { invites: req.body.email } },
        { new: true }
      );
      if (!invites) {
        throw { code: 400, message: "REMOVE_INVITE_FAILED" };
      }
      return res.status(200).json({
        status: true,
        message: "REMOVE_INVITE_SUCCESS",
        email: req.body.email,
      });
    } catch (err) {
      return res.status(err.code || 500).json({
        status: false,
        message: err.message,
      });
    }
  }
}
export default new InviteController();
