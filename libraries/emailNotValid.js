import isEmailValid from "./isEmailValid.js";

const emailNotValid = async (form, answers) => {
  const found = form.questions.filter((question) => {
    if (question.type == "Email") {
      const answer = answers.find((answer) => answer.questionId == question.id);
      // skip cek email, kalau tidak ada jawaban dan requried false
      if (question.required === false) {
        if (
          answer == undefined ||
          answer.value == undefined ||
          answer.value == "" ||
          answer.value == null
        ) {
          return false;
        }
      }

      if (answer) {
        if (!isEmailValid(answer.value)) {
          return true;
        }
      }
    }
  });
  return found;
};
export default emailNotValid;
