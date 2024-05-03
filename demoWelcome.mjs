import inquirer from "inquirer";
import dotenv from "dotenv";
import expressHandlers from "./middleware/express/handlers.mjs";
import Prompts from "./lib/Prompts.mjs";
import { createUser, loginUser } from "./middleware/auth0/handlers.mjs";
import blackjack from "./middleware/ai/blackjack.mjs";
import slots from "./middleware/ai/slots.mjs";
import mathOrExit from "./handlers/handlers.mjs";
import { readFileSync } from "fs";
import ora from "ora";

dotenv.config();

let prompt = new Prompts();

async function main() {
  let balanceCheck = null;
  const entryAnswers = await inquirer.prompt(prompt.entryQuestion);
  let accessToken = null;

  if (entryAnswers.entry === "Enter Casino") {
    console.log("Great! Let's have some fun!");
    let loginAnswers = await inquirer.prompt(prompt.signUporLogin);
    while (loginAnswers.entry !== "Exit") {
      if (loginAnswers.entry === "Log In") {
        const loginInfo = await inquirer.prompt(prompt.loginQuestions);
        try {
          const spinner = ora({
            text: "Logging in...",
            spinner: "bouncingBar", // You can choose different spinner styles
            color: "cyan",
          }).start();
          let response = await loginUser(loginInfo.email, loginInfo.password);
          spinner.succeed("Welcome!");
          accessToken = response.data.access_token;
          balanceCheck = await expressHandlers.getBalance(accessToken);
          console.log("Your current bit balance is: ", balanceCheck[0]);
        } catch (error) {
          console.error("Error on Login");
          process.exit();
        }
        if (balanceCheck) {
          if (balanceCheck[0] < 10) {
            console.log(
              "you do not have enough bits to play, you must have 10 bits",
            );
            await mathOrExit(
              inquirer,
              prompt,
              expressHandlers,
              accessToken,
              balanceCheck,
            );
          }
        }
        let gamblerChoice = await inquirer.prompt(prompt.mathorGame);
        while (gamblerChoice.entry !== "Log Out") {
          if (gamblerChoice.entry === "Play Game") {
            let gameChoice = await inquirer.prompt(prompt.demoGame);
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
              const spinner = ora({
                text: "Reaching Database...",
                spinner: "dots", // You can choose different spinner styles
                color: "yellow",
              }).start();

              let slotResponse = await expressHandlers.gamePatchBalance(
                accessToken,
                bits,
                amountSpent,
              );
              spinner.succeed("Server contacted successfully");
              console.log("Your new bit balance is: ", slotResponse[0]);
            }
          }

          if (gamblerChoice.entry === "Solve Math Problem") {
            const difficulty = await inquirer.prompt(
              prompt.difficultyQuestions,
            );
            const mathJSON = JSON.parse(
              readFileSync("./middleware/ai/demo-math.json"),
            );
            const { problem, answer } =
              mathJSON[difficulty.difficulty][
                Math.floor(Math.random() * 9) + 1
              ];
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
              balanceCheck[0] = response[0];
            } else {
              console.log("Better luck next time!");
            }
          }

          gamblerChoice = await inquirer.prompt(prompt.mathorGame);
        }
      } else if (loginAnswers.entry === "Sign Up") {
        console.log("Great! Let's get you signed up!");
        const signUpInfo = await inquirer.prompt(prompt.signUpQuestions);
        if (signUpInfo.password === signUpInfo.confirmPassword) {
          try {
            let response = await createUser(
              signUpInfo.email,
              signUpInfo.password,
            );
            const accessId = response.data._id;
            await expressHandlers.signUp(accessId);
          } catch (error) {
            console.log(error);
            if (error.response.data.error) {
              console.error(error.response.data.error);
            } else if (error.response.data.message) {
              console.error(
                error.response.data.message,
                error.response.data.policy,
              );
            }
          }
        }
      } else if (signUpInfo.password !== signUpInfo.confirmPassword) {
        console.log("Passwords do not match. Please try again.");
        process.exit();
      }
      loginAnswers = await inquirer.prompt(prompt.signUporLogin);
    }
  } else {
    console.log("Goodbye! Hope to see you soon!");
    process.exit();
  }
}

main();
