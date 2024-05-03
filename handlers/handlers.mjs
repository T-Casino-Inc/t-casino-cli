import { readFileSync } from "fs";

async function mathOrExit(
  inquirer,
  prompt,
  expressHandlers,
  accessToken,
  balanceCheck,
) {
  let mathOrExit = await inquirer.prompt(prompt.mathorExit);
  while (mathOrExit.entry === "Solve Math Problem") {
    const difficulty = await inquirer.prompt(prompt.difficultyQuestions);
    const mathJSON = JSON.parse(readFileSync("./middleware/ai/demo-math.json"));
    const { problem, answer } =
      mathJSON[difficulty.difficulty][Math.floor(Math.random() * 9) + 1];
    let mathPrompt = [
      {
        type: "input",
        name: "question",
        message: problem,
      },
    ];
    const userAnswer = await inquirer.prompt(mathPrompt);
    if (userAnswer.question === answer) {
      let response = null;
      if (difficulty.difficulty === "Easy: 1 bit") {
        response = await expressHandlers.mathPatchBalance(accessToken, 1, 0);
      } else if (difficulty.difficulty === "Medium: 10 bits") {
        response = await expressHandlers.mathPatchBalance(accessToken, 10, 0);
      } else if (difficulty.difficulty === "Hard: 30 bits") {
        response = await expressHandlers.mathPatchBalance(accessToken, 30, 0);
      }
      console.log("Your new bit balance is: ", response[0]);
      balanceCheck[0] = response[0];
    } else if (validation.result === "incorrect") {
      console.log(validation.message);
    }
    mathOrExit = await inquirer.prompt(prompt.mathorExit);
  }
}

export default mathOrExit;
