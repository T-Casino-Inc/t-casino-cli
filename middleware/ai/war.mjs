import inquirer from "inquirer";

const suits = ["♥", "♦", "♣", "♠"];
const ranks = [
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "J",
  "Q",
  "K",
  "A",
];

function createDeck() {
  let deck = [];
  for (const suit of suits) {
    for (const rank of ranks) {
      deck.push({ rank, suit });
    }
  }
  return deck;
}

function shuffleDeck(deck) {
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
}

function drawCard(deck) {
  return deck.pop();
}

function getCardValue(card) {
  if (card.rank === "A") return 14; // Ace is high in War
  if (card.rank === "K") return 13;
  if (card.rank === "Q") return 12;
  if (card.rank === "J") return 11;
  return parseInt(card.rank); // Numerical cards
}

console.log("Welcome to Terminal Casino WAR!");

function playRound(playerCard, computerCard) {
  const playerValue = getCardValue(playerCard);
  const computerValue = getCardValue(computerCard);

  console.log(
    `\x1b[1mPlayer plays: ${playerCard.rank} of ${playerCard.suit}\x1b[0m`,
  );
  console.log(`Computer plays: ${computerCard.rank} ${computerCard.suit}`);

  if (playerValue > computerValue) {
    console.log("\x1b[1mPlayer wins the round!\x1b[0m");
    return 1;
  } else if (playerValue < computerValue) {
    console.log("Computer wins the round!");
    return -1;
  } else {
    console.log("It's a tie!");
    return 0;
  }
}

function main() {
  let deck = createDeck();
  deck = shuffleDeck(deck);
  let playerDeck = deck.slice(0, deck.length / 2);
  let computerDeck = deck.slice(deck.length / 2);
  let roundCount = 0;

  function nextRound() {
    if (
      playerDeck.length === 0 ||
      computerDeck.length === 0 ||
      roundCount >= 5
    ) {
      console.log("End of the session.");
      if (roundCount >= 5) {
        inquirer
          .prompt([
            {
              type: "confirm",
              name: "continue",
              message: "Do you want to continue playing?",
              default: false,
            },
          ])
          .then((answers) => {
            if (answers.continue) {
              roundCount = 0; // Reset the round count
              nextRound(); // Continue playing
            } else {
              console.log("Thank you for playing!");
              process.exit(); // Exit the application
            }
          });
      } else {
        console.log(
          playerDeck.length === 0
            ? "Computer wins the game!"
            : "Player wins the game!",
        );
        process.exit();
      }
      return;
    }

    inquirer
      .prompt([
        {
          type: "confirm",
          name: "draw",
          message: "Press Enter to play the next card...",
          default: true,
        },
      ])
      .then(() => {
        const playerCard = drawCard(playerDeck);
        const computerCard = drawCard(computerDeck);
        playRound(playerCard, computerCard);
        roundCount++;
        nextRound(); // Continue to the next round
      });
  }

  nextRound(); // Start the first round
}
main();
export default main;
