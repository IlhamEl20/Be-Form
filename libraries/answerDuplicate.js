const answerDuplicate = async (answers) => {
  var seen = new Set();
  return answers.some((answer) => {
    //duplicate
    if (seen.has(answer.questionId)) {
      return true;
    }
    seen.add(answer.questionId);
  });
};
export default answerDuplicate;
