import mongoose, { Mongoose, deleteModel } from "mongoose";
import Form from "../models/Form.js";

const allowedTypes = ["Text", "Radio", "Checkbox", "Dropdown", "Email"];

class QuestionsController {
  async index(req, res) {
    try {
      if (!req.params.id) {
        throw { code: 400, message: "FORM_ID_REQUIRED" };
      }
      if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        throw { code: 400, message: "INVALID_ID" };
      }
      const form = await Form.findOne({
        _id: req.params.id,
        userId: req.jwt.userId,
      });
      //   const form = await Form.findOne({
      //     _id: req.params.id,
      //      userId: req.jwt.userId,
      //   });.select("questions");
      if (!form) {
        throw { code: 404, message: "QUESTION_NOT_FOUND" };
      }

      return res.status(200).json({
        status: true,
        form,
      });
    } catch (err) {
      if (!err.code) {
        err.code = 500;
      }
      res.status(err.code).json({
        status: false,
        message: err.message,
        index: err.index,
      });
    }
  }

  //create questions
  async store(req, res) {
    try {
      //check form id
      if (!req.params.id) {
        throw { code: 428, message: "ID_REQUIRED" };
      }
      if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        throw { code: 400, message: "INVALID_ID" };
      }

      //input field
      const newQuestion = {
        id: new mongoose.Types.ObjectId(),
        type: "Text",
        question: null,
        options: [],
        required: false,
      };

      //update form
      const question = await Form.findOneAndUpdate(
        { _id: req.params.id, userId: req.jwt.userId },
        { $push: { questions: newQuestion } },
        { new: true }
      );

      if (!question) {
        throw { code: 400, message: "ADD_QUESTION_FAILED" };
      }

      return res.status(200).json({
        status: true,
        message: "ADD_QUESTION_SUCCESS",
        question: newQuestion,
      });
    } catch (err) {
      console.log(err);
      return res.status(err.code || 500).json({
        status: false,
        message: err.message,
      });
    }
  }
  //Update Qeustions
  async update(req, res) {
    try {
      //check form id
      if (!req.params.id) {
        throw { code: 428, message: "FORM_ID_REQUIRED" };
      }
      if (!req.params.questionId) {
        throw { code: 428, message: "QUESTION_ID_REQUIRED" };
      }
      if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        throw { code: 400, message: "INVALID_ID" };
      }
      if (!mongoose.Types.ObjectId.isValid(req.params.questionId)) {
        throw { code: 400, message: "INVALID_ID" };
      }
      let field = {};
      if (req.body.hasOwnProperty("question")) {
        field["questions.$[indexQuestion].question"] = req.body.question;
      } else if (req.body.hasOwnProperty("required")) {
        field["questions.$[indexQuestion].required"] = req.body.required;
      } else if (req.body.hasOwnProperty("type")) {
        if (!allowedTypes.includes(req.body.type)) {
          throw { code: 400, message: "INVALID_TYPE" };
        }
        field["questions.$[indexQuestion].type"] = req.body.type;
      }
      const question = await Form.findOneAndUpdate(
        { _id: req.params.id, userId: req.jwt.userId },
        { $set: field },
        {
          arrayFilters: [
            {
              "indexQuestion.id": new mongoose.Types.ObjectId(
                req.params.questionId
              ),
            },
          ],
          new: true,
        }
      );

      if (!question) {
        throw { code: 500, message: "UPDATE_QUESTION_FAILED" };
      }

      return res.status(200).json({
        status: true,
        message: "UPDATE_QUESTION_SUCCESS",
        question,
      });
    } catch (err) {
      return res.status(err.code || 500).json({
        status: false,
        message: err.message,
      });
    }
  }
  // delete questions
  async destroy(req, res) {
    try {
      const question = await Form.findOneAndUpdate(
        { _id: req.params.id, userId: req.jwt.userId },
        {
          $pull: {
            questions: {
              id: new mongoose.Types.ObjectId(req.params.questionId),
            },
          },
        },
        { new: true }
      );
      if (!question) {
        throw { code: 500, message: "DELETE_QUESTION_FAILED" };
      }
      if (!req.body.questionId) {
        throw { code: 400, message: "QUESTION_ID_REQUIRED" };
      }

      res.status(200).json({
        status: true,
        message: "DELETE_QUESTION_SUCCESS",
        question,
      });
    } catch (err) {
      if (!err.code) {
        err.code = 500;
      }
      if ((err.code = 500)) {
        res.status(err.code).json({
          status: false,
          message: "DELETE_QUESTION_FAILED",
        });
      }
      res.status(err.code).json({
        status: false,
        message: err.message,
      });
    }
  }
}
export default new QuestionsController();
