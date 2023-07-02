import mongoose, { deleteModel } from "mongoose";
import Form from "../models/Form.js";

class ResponseController {
  async lists(req, res) {
    try {
      if (!req.params.formId) {
        throw { code: 400, message: "REQUIRE_FORM_ID" };
      }
      if (!mongoose.Types.ObjectId.isValid(req.params.formId)) {
        throw { code: 400, message: "INVALID_ID" };
      }
      const form = await Form.findOne({
        _id: req.params.formId,
        userId: req.jwt.id,
      }).populate("answers");
      if (!form) {
        throw { code: 400, message: "FORM_NOT_FOUND" };
      }

      return res.status(200).json({
        status: true,
        message: "ANSWERS_FOUND",
        total: form.answers.length,
        form,
        answers: form.answers,
      });
    } catch (err) {
      return res.status(err.code || 500).json({
        status: false,
        message: err.message,
      });
    }
  }
  async summaries(req, res) {
    try {
      if (!req.params.formId) {
        throw { code: 400, message: "REQUIRE_FORM_ID" };
      }
      if (!mongoose.Types.ObjectId.isValid(req.params.formId)) {
        throw { code: 400, message: "INVALID_ID" };
      }
      const form = await Form.findOne({
        _id: req.params.formId,
        userId: req.jwt.id,
      }).populate("answers");
      if (!form) {
        throw { code: 400, message: "FORM_NOT_FOUND" };
      }
      const summaries = form.questions.map((question) => {
        const summary = {
          type: question.type,
          questionId: question.id,
          question: question.question,
          answers: form.answers.map((answer) => answer[question.id]),
        };
        return summary;
      });

      return res.status(200).json({
        status: true,
        message: "ANSWERS_FOUND",
        summaries,
      });
    } catch (err) {
      return res.status(err.code || 500).json({
        status: false,
        message: err.message,
      });
    }
  }
}
export default new ResponseController();
