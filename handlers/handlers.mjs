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
    console.log(validation);
    if (validation.result === "correct") {
      let response = null;
      console.log("this was the difficulty", difficulty.difficulty);
      if (difficulty.difficulty === "Easy: 1 bit") {
        console.log("you were right, and now we are going to the server!");
        response = await expressHandlers.mathPatchBalance(accessToken, 1, 0);
      } else if (difficulty.difficulty === "medium") {
        response = await expressHandlers.mathPatchBalance(accessToken, 10, 0);
      } else if (difficulty.difficulty === "hard") {
        response = await expressHandlers.mathPatchBalance(accessToken, 30, 0);
      }
      console.log(validation.message);
      console.log("Your new bit balance is: ", response[0]);
      console.log(typeof response);
    } else if (validation.result === "incorrect") {
      console.log(validation.message);
    }
    mathOrExit = await inquirer.prompt(prompt.mathorExit);
  }
}

export default mathOrExit;
