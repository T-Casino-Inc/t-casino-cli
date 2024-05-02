class Prompts {
  entryQuestion = [
    {
      type: "list",
      name: "entry",
      message: "Welcome to our Terminal Casino! What would you like to do?",
      choices: ["Enter Casino", "Exit"],
    },
  ];

  signUporLogin = [
    {
      type: "list",
      name: "entry",
      message: "Would you like to sign up or log in?",
      choices: ["Sign Up", "Log In", "Exit"],
    },
  ];

  signUpQuestions = [
    {
      type: "input",
      name: "email",
      message: "Please enter a valid email:",
      validate: (input) => (input ? true : "Email cannot be empty."),
    },
    {
      type: "password",
      name: "password",
      message: "Please enter your password:",
      validate: (password) =>
        password.length >= 8 ? true : "Password must be at least 8 characters.",
    },
    {
      type: "password",
      name: "confirmPassword",
      message: "Please confirm your password:",
      validate: (confirmPassword, answers) => {
        return confirmPassword === answers.password
          ? true
          : "Passwords do not match.";
      },
    },
  ];

  loginQuestions = [
    {
      type: "input",
      name: "email",
      message: "Please enter your email:",
    },
    {
      type: "password",
      name: "password",
      message: "Please enter your password:",
    },
  ];
  mathorExit = [
    {
      type: "list",
      name: "entry",
      message: "Would you like to play a math game or exit?",
      choices: ["Play Math Game", "Exit"],
    },
  ];
}

export default Prompts;
