import inquirer from "inquirer";

const symbols = ["@", "#", "$", "%", "&", "*"];

function promptUser() {
  return inquirer.prompt([
    {
      type: "confirm",
      name: "play",
      message: 'Press Enter to spin the slots or "n" to quit:',
      default: true,
    },
  ]);
}

function spinReels() {
  return [
    symbols[Math.floor(Math.random() * symbols.length)],
    symbols[Math.floor(Math.random() * symbols.length)],
    symbols[Math.floor(Math.random() * symbols.length)],
  ];
}

function displayResults(reelResults) {
  console.log(`| ${reelResults[0]} | ${reelResults[1]} | ${reelResults[2]} |`);
}

function checkWin(reelResults) {
  if (reelResults[0] === reelResults[1] && reelResults[1] === reelResults[2]) {
    console.log("Congratulations! You've won!");
    return true;
  } else {
    console.log("Try again!");
    return false;
  }
}

async function playGame(balanceCheck) {
  let amountSpent = 0;
  let currentBalance = balanceCheck;
  let continuePlaying = true;
  do {
    const answer = await promptUser(); // Wait for user input
    continuePlaying = answer.play;
    if (continuePlaying) {
      const reelResults = spinReels(); // Spin the reels
      displayResults(reelResults); // Show the spun symbols
      amountSpent += 1; // Increment amount spent
      if (checkWin(reelResults)) {
        currentBalance += 10; // Increment balance by 10
      } else {
        currentBalance -= 1;
      }
      console.log(`Current balance: ${currentBalance}`);
      if (currentBalance < 1) {
        console.log("You don't have enough bits to play.");
        break;
      }
    }
  } while (continuePlaying);

  console.log("Thank you for playing!");
  let wallet = {
    bits: currentBalance,
    amountSpent,
  };
  return wallet;
}

// Start the game
export default playGame;
