import inquirer from "inquirer";
import fs from "fs";
// Define card suits and ranks
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

// Function to create a new shuffled deck
function createDeck() {
  let deck = [];
  for (let suit of suits) {
    for (let rank of ranks) {
      deck.push({ rank, suit });
    }
  }
  shuffleDeck(deck);
  return deck;
}

// Shuffle the deck
function shuffleDeck(deck) {
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
}

// Get a string representation of the card
function getCardString(card) {
  return `${card.rank}${card.suit}`;
}

// Get the numeric value of a card for scoring
function getCardValue(card) {
  const { rank } = card;
  if (rank === "A") return 11; // Value of Aces
  if (["J", "Q", "K"].includes(rank)) return 10;
  return parseInt(rank);
}

// Calculate the total value of a hand, adjust for Aces as needed
function getHandValue(hand) {
  let value = hand.reduce((acc, card) => acc + getCardValue(card), 0);
  let aceCount = hand.filter((card) => card.rank === "A").length;
  while (value > 21 && aceCount > 0) {
    value -= 10;
    aceCount--;
  }
  return value;
}

// Display the hand, hiding dealer's second card initially
function displayHand(hand, showAll = true) {
  return showAll
    ? hand.map(getCardString).join(", ")
    : `${getCardString(hand[0])}, [hidden card]`;
}

// Log game results to a file
function logResults(playerTotal, dealerTotal, result) {
  const logMessage = `Game played at ${new Date().toLocaleString()}: Player total - ${playerTotal}, Dealer total - ${dealerTotal}, Result - ${result}\n`;
  fs.appendFileSync("game_results.log", logMessage);
  console.log("Results have been logged.");
}

// Main game logic
async function playGame() {
  console.log("Welcome to Terminal Casino BlackJack!");
  while (true) {
    const deck = createDeck();
    const playerHand = [deck.pop(), deck.pop()];
    const dealerHand = [deck.pop(), deck.pop()];

    console.log(`Dealer shows: ${displayHand(dealerHand, false)}`);
    console.log(
      `Your hand: ${displayHand(playerHand)} (Total: ${getHandValue(playerHand)})`,
    );

    while (getHandValue(playerHand) < 21) {
      const { action } = await inquirer.prompt({
        type: "list",
        name: "action",
        message: "Choose your action:",
        choices: ["Hit", "Stay", "Exit"],
      });

      if (action === "Exit") return console.log("Game exited.");
      if (action === "Stay") break;

      playerHand.push(deck.pop());
      console.log(
        `Your hand: ${displayHand(playerHand)} (Total: ${getHandValue(playerHand)})`,
      );
    }

    let playerTotal = getHandValue(playerHand);
    if (playerTotal > 21) {
      console.log("Bust! Better luck next time!");
      logResults(playerTotal, getHandValue(dealerHand), "Player Bust");
      continue;
    }

    while (getHandValue(dealerHand) < 17) {
      dealerHand.push(deck.pop());
    }

    let dealerTotal = getHandValue(dealerHand);
    console.log(
      `Dealer's hand: ${displayHand(dealerHand)} (Total: ${dealerTotal})`,
    );

    let result = "";
    if (dealerTotal > 21) {
      console.log("Dealer busts, you win!");
      result = "Dealer Busts";
    } else if (playerTotal > dealerTotal) {
      console.log("You win!");
      result = "Player Wins";
    } else if (playerTotal === dealerTotal) {
      console.log("Push (tie).");
      result = "Push";
    } else {
      console.log("Dealer wins.");
      result = "Dealer Wins";
    }

    logResults(playerTotal, dealerTotal, result);

    const { continuePlaying } = await inquirer.prompt({
      type: "confirm",
      name: "continuePlaying",
      message: "Do you want to play another game?",
      default: true,
    });

    if (!continuePlaying) break;
  }

  console.log("Thank you for playing!");
}

// Start the game
export default playGame;
