const questionRequiredButEmpty = async (form, answers) => {
  const found = form.questions.filter((question) => {
    if (question.required === true) {
      const answer = answers.find((answer) => answer.questionId == question.id);
      if (
        answer == undefined ||
        answer.value == undefined ||
        answer.value == ""
      ) {
        return true;
      }
    }
  });
  return found.length > 0 ? true : false;
};

export default questionRequiredButEmpty;
