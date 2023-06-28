import mongoose, { deleteModel } from "mongoose";
import Answer from "../models/Answer.js";
import answerDuplicate from "../libraries/answerDuplicate.js";
import questionRequiredButEmpty from "../libraries/questionRequired.js";
import Form from "../models/Form.js";

class AnswerController {
  async store(req, res) {
    try {
      if (!req.params.formId) {
        throw { code: 400, message: "REQUIRE_FORM_ID" };
      }
      const form = await Form.findById(req.params.formId);

      if (!mongoose.Types.ObjectId.isValid) {
        throw { code: 400, message: "INVALID_ID" };
      }
      const isDuplicate = await answerDuplicate(req.body.answers);
      if (isDuplicate) {
        throw { code: 400, message: "DUPLICATE_ANSWERS" };
      }
      const questionRequiredEmpty = await questionRequiredButEmpty(
        form,
        req.body.answers
      );
      if (questionRequiredEmpty) {
        throw { code: 400, message: "QUESTION_REQUIRE_BUT_EMPTY" };
      }
      let fields = {};
      req.body.answers.forEach((answer) => {
        fields[answer.questionId] = answer.value;
      });
      const answers = await Answer.create({
        formId: req.params.formId,
        userId: req.jwt.id,
        ...fields,
      });
      if (!answers) {
        throw { code: 400, message: "ANSWER_FAILED" };
      }
      return res.status(200).json({
        status: true,
        message: "ANSWER_SUCCESS",
        answers,
      });
    } catch (err) {
      console.log(err);
      return res.status(err.code || 500).json({
        status: false,
        message: err.message,
      });
    }
  }
}
export default new AnswerController();
