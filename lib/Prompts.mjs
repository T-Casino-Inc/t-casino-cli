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
      message: "Would you like to solve a math problem to earn bits or exit?",
      choices: ["Solve Math Problem", "Exit"],
    },
  ];
  mathorGame = [
    {
      type: "list",
      name: "entry",
      message: "Would you like to solve a math problem or play a game?",
      choices: ["Solve Math Problem", "Play Game", "Exit"],
    },
  ];
  whichGame = [
    {
      type: "list",
      name: "entry",
      message: "Which game would you like to play?",
      choices: ["War", "BlackJack", "Slots", "Exit"],
    },
  ];
  difficultyQuestions = [
    {
      type: "list",
      name: "difficulty",
      message: "Please select a difficulty level:",
      choices: ["Easy: 1 bit", "Medium: 10 bits", "Hard: 30 bits"],
    },
  ];
}

export default Prompts;
