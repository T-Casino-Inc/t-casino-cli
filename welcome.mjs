import inquirer from "inquirer";
import dotenv from "dotenv";
import mathQuestionHandler from "./middleware/ai/chatGPT.mjs";
import { signUp, login } from "./middleware/express/handlers.mjs";
import { createUser, loginUser } from "./middleware/auth0/handlers.mjs";
import Prompts from "./lib/Prompts.mjs";
import validateHandler from "./middleware/ai/validate.mjs";

dotenv.config();

let prompt = new Prompts();

async function main() {
  let balanceCheck = null;
  const entryAnswers = await inquirer.prompt(prompt.entryQuestion);

  if (entryAnswers.entry === "Enter Casino") {
    console.log("Great! Let's have some fun!");
    const loginAnswers = await inquirer.prompt(prompt.signUporLogin);
    if (loginAnswers.entry === "Log In") {
      const loginInfo = await inquirer.prompt(prompt.loginQuestions);
      try {
        let response = await loginUser(loginInfo.email, loginInfo.password);
        const accessToken = response.data.access_token;

        balanceCheck = await login(accessToken);
      } catch (error) {
        console.error("Error on Login");
      }
      if (balanceCheck) {
        if (balanceCheck[0] < 10) {
          console.log(
            "you do not have enough bits to play, you must have 10 bits",
          );
          let mathOrExit = await inquirer.prompt(prompt.mathorExit);
          if (mathOrExit.entry === "Play Math Game") {
            try {
              console.log("here will be your future math question!");
            } catch (error) {
              console.error("Error on Math Question", error);
            }
          } else if (mathOrExit.entry === "Exit") {
            console.log("Goodbye! Hope to see you soon!");
            process.exit();
          }
        }
      }
      // if (loginInfo) {
      //   try {
      //     const mathQuestionAnswer = await inquirer.prompt(mathQuestions);
      //     // console.log("your answer", mathQuestionAnswer.question);
      //     // console.log("you question", mathQuestions[0].message);
      //     const validation = await validateHandler(
      //       mathQuestionAnswer.question,
      //       mathQuestions[0].message,
      //     );
      //     console.log(validation);
      //   } catch (error) {
      //     console.error("Error on Math Question", error);
      //   }
      // }
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
