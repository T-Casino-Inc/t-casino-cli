async function mathOrExit(
  inquirer,
  prompt,
  mathQuestionHandler,
  validateHandler,
  expressHandlers,
  accessToken,
) {
  let mathOrExit = await inquirer.prompt(prompt.mathorExit);
  while (mathOrExit.entry === "Solve Math Problem") {
    const difficulty = await inquirer.prompt(prompt.difficultyQuestions);
    const mathQuestions = await mathQuestionHandler(difficulty.difficulty);
    const mathQuestionAnswer = await inquirer.prompt(mathQuestions);
    let validation = await validateHandler(
      mathQuestionAnswer.question,
      mathQuestions[0].message,
      difficulty.difficulty,
    );
    validation = JSON.parse(validation);
    if (validation.result === "correct") {
      console.log(validation.message);
      let response = null;
      if (difficulty.difficulty === "Easy: 1 bit") {
        response = await expressHandlers.mathPatchBalance(accessToken, 1, 0);
      } else if (difficulty.difficulty === "Medium: 10 bits") {
        response = await expressHandlers.mathPatchBalance(accessToken, 10, 0);
      } else if (difficulty.difficulty === "Hard: 30 bits") {
        response = await expressHandlers.mathPatchBalance(accessToken, 30, 0);
      }
      console.log("Your new bit balance is: ", response[0]);
    } else if (validation.result === "incorrect") {
      console.log(validation.message);
    }
    mathOrExit = await inquirer.prompt(prompt.mathorExit);
  }
}

export default mathOrExit;
