import inquirer from "inquirer";
import dotenv from "dotenv";
import mathQuestionHandler from "./middleware/ai/generateMath.mjs";
import expressHandlers from "./middleware/express/handlers.mjs";
import Prompts from "./lib/Prompts.mjs";
import { createUser, loginUser } from "./middleware/auth0/handlers.mjs";
import validateHandler from "./middleware/ai/validate.mjs";
import blackjack from "./middleware/ai/blackjack.mjs";
import slots from "./middleware/ai/slots.mjs";
import mathOrExit from "./handlers/handlers.mjs";

dotenv.config();

let prompt = new Prompts();

async function main() {
  let balanceCheck = null;
  const entryAnswers = await inquirer.prompt(prompt.entryQuestion);
  let accessToken = null;

  if (entryAnswers.entry === "Enter Casino") {
    console.log("Great! Let's have some fun!");
    const loginAnswers = await inquirer.prompt(prompt.signUporLogin);
    if (loginAnswers.entry === "Log In") {
      const loginInfo = await inquirer.prompt(prompt.loginQuestions);
      try {
        let response = await loginUser(loginInfo.email, loginInfo.password);
        accessToken = response.data.access_token;
        balanceCheck = await expressHandlers.getBalance(accessToken);
        console.log("Your current bit balance is: ", balanceCheck[0]);
      } catch (error) {
        console.error("Error on Login");
      }
      if (balanceCheck) {
        if (balanceCheck[0] < 10) {
          console.log(
            "you do not have enough bits to play, you must have 10 bits",
          );
          await mathOrExit(
            inquirer,
            prompt,
            mathQuestionHandler,
            validateHandler,
            expressHandlers,
            accessToken,
          );
        }
        let gamblerChoice = await inquirer.prompt(prompt.mathorGame);
        while (gamblerChoice.entry !== "Exit") {
          if (gamblerChoice.entry === "Play Game") {
            let gameChoice = await inquirer.prompt(prompt.whichGame);
            if (gameChoice.entry === "War") {
              console.log("War");
              war();
            } else if (gameChoice.entry === "BlackJack") {
              console.log("BlackJack");
              await blackjack();
            } else if (gameChoice.entry === "Slots") {
              console.log("Slots");
              let { bits, amountSpent } = await slots(balanceCheck[0]);
              console.log("bits", bits, "amountSpent", amountSpent);

              let slotResponse = await expressHandlers.gamePatchBalance(
                accessToken,
                bits,
                amountSpent,
              );
              console.log("Your new bit balance is: ", slotResponse[0]);
            } else if (gameChoice.entry === "Exit") {
              console.log("Goodbye! Hope to see you soon!");
              process.exit();
            }
          }
          if (gamblerChoice.entry === "Solve Math Problem") {
            const difficulty = await inquirer.prompt(
              prompt.difficultyQuestions,
            );
            const mathQuestions = await mathQuestionHandler(
              difficulty.difficulty,
            );
            let { type, name, message, answer } = mathQuestions[0];
            console.log(message, answer);
            const mathQuestionAnswer = await inquirer.prompt([
              { type, name, message },
            ]);

            let userAnswer = mathQuestionAnswer.entry;
            console.log(typeof userAnswer, typeof answer);
            if (String(userAnswer) === answer) {
              let response = null;
              if (difficulty.difficulty === "Easy: 1 bit") {
                response = await expressHandlers.mathPatchBalance(
                  accessToken,
                  1,
                  0,
                );
              } else if (difficulty.difficulty === "Medium: 10 bits") {
                response = await expressHandlers.mathPatchBalance(
                  accessToken,
                  10,
                  0,
                );
              } else if (difficulty.difficulty === "Hard: 30 bits") {
                response = await expressHandlers.mathPatchBalance(
                  accessToken,
                  30,
                  0,
                );
              }
              console.log("Your new bit balance is: ", response[0]);
            } else {
              console.log("Better luck next time!");
            }
          }
          gamblerChoice = await inquirer.prompt(prompt.mathorGame);
        }
      }
    } else if (loginAnswers.entry === "Sign Up") {
      console.log("Great! Let's get you signed up!");
      const signUpInfo = await inquirer.prompt(prompt.signUpQuestions);
      if (signUpInfo.password === signUpInfo.confirmPassword) {
        try {
          createUser(signUpInfo.email, signUpInfo.password);
          signUp(accessToken);
        } catch (error) {
          if (error.response.data.error) {
            console.error(error.response.data.error);
          } else if (error.response.data.message) {
            console.error(
              error.response.data.message,
              error.response.data.policy,
            );
          }
        }
      } else if (signUpInfo.password !== signUpInfo.confirmPassword) {
        console.log("Passwords do not match. Please try again.");
        process.exit();
      }
    }
  } else {
    console.log("Goodbye! Hope to see you soon!");
    process.exit();
  }
}

main();
