import inquirer from "inquirer";
import dotenv from "dotenv";
import expressHandlers from "./middleware/express/handlers.mjs";
import Prompts from "./lib/Prompts.mjs";
import { createUser, loginUser } from "./middleware/auth0/handlers.mjs";
import blackjack from "./middleware/ai/blackjack.mjs";
import slots from "./middleware/casino/slots.mjs";
import mathOrExit from "./handlers/handlers.mjs";
import { readFileSync } from "fs";
import ora from "ora";
import figlet from "figlet";
import chalk from "chalk";

dotenv.config();
const spinner = ora({
  text: "Logging in...",
  spinner: "bouncingBar",
  color: "cyan",
});
const spinner2 = ora({
  text: "Checking balance...",
  spinner: "dots",
  color: "green",
});

let prompt = new Prompts();

async function main() {
  let balanceCheck = null;
  console.log(chalk.green(figlet.textSync("Terminal Casino!!")));
  const entryAnswers = await inquirer.prompt(prompt.entryQuestion);
  let accessToken = null;

  if (entryAnswers.entry === "Enter Casino") {
    let loginAnswers = await inquirer.prompt(prompt.signUporLogin);
    while (loginAnswers.entry !== "Exit") {
      if (loginAnswers.entry === "Log In") {
        const loginInfo = await inquirer.prompt(prompt.loginQuestions);
        try {
          spinner.start();
          let response = await loginUser(loginInfo.email, loginInfo.password);
          spinner.succeed("Welcome!");
          accessToken = response.data.access_token;
        } catch (error) {
          spinner.fail(chalk.red.bold("Error on Login"));
          loginAnswers = await inquirer.prompt(prompt.signUporLogin);
        }
        try {
          spinner2.start();
          balanceCheck = await expressHandlers.getBalance(accessToken);
          spinner2.succeed("Received balance!");
          console.log(
            chalk.green.bold("Your current bit balance is: ", balanceCheck[0]),
          );
        } catch (error) {
          spinner2.fail(chalk.red.bold("Error on balance check"));
          process.exit();
        }
        if (balanceCheck) {
          if (balanceCheck[0] < 10) {
            console.log(
              chalk.red.bold(
                "You do not have enough bits to play, you must have 10 bits",
              ),
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
        while (gamblerChoice.entry !== "Exit") {
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
                text: "Updating Database...",
                spinner: "dots",
                color: "yellow",
              }).start();

              let slotResponse = await expressHandlers.gamePatchBalance(
                accessToken,
                bits,
                amountSpent,
              );
              spinner.succeed("Database updated");
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
            console.log(
              chalk.green.bold(
                "You have successfully signed up! Please log in.",
              ),
            );
          } catch (error) {
            if (error.response.data.message) {
              console.error(
                chalk.red.bold(
                  error.response.data.message,
                  error.response.data.policy,
                ),
              );
            } else {
              console.error(chalk.red.bold("Error on Sign Up"));
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
