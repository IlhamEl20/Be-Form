const optionValueNotExist = async (form, answers) => {
  const found = form.questions.filter((question) => {
    if (question.type == "Radio" || question.type == "Dropdown") {
      const answer = answers.find((answer) => answer.questionId == question.id);

      if (answer != undefined) {
        const option = question.options.find(
          (option) => option.value == answer.value
        );
        if (option == undefined) {
          return true;
        }
      }
    } else if (question.type == "Checkbox") {
      const answer = answers.find((answer) => answer.questionId == question.id);
      if (answer) {
        return answer.value.some((value) => {
          const option = question.options.find(
            (option) => option.value == value
          );
          if (option == undefined) {
            return true;
          }
        });
      }
    }
  });
  return found;
};
export default optionValueNotExist;
