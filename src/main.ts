import "./style.css";

// 1. type for coordinates, to track each single cell
type Coordinates = [number, number];

// 2. type for player: name | symbol | score
type Player = {
  name: string;
  symbol: "X" | "O"; // union type
  score: number;
};

// 3. type for my cells, so they could have a element type, marked: string | null
type CellState = {
  markedBy: string | null;
  element: Element;
};

// utility functions or tools to keep track of things
function coordToId(coord: Coordinates): `${number}-${number}` {
  const [row, col] = coord;
  return `${row}-${col}`;
}

function idToCoord(id: `${number}-${number}`): Coordinates {
  const [row, col] = id.split("-");
  return [parseInt(row), parseInt(col)];
}

// define the grid size
const gridSize = 3;

// create an array of grid cell styles
const gridCellStyling = [
  "aspect-square",
  "bg-neutral-100",
  "hover:bg-neutral-200",
  "active:bg-neutral-300",
];

//create an array of grid-container styles
const gridStyling = [
  "grid",
  "grid-cols-3",
  "bg-retro-purple",
  "border-4",
  "border-retro-purple",
  "gap-1",
  "w-full",
  "w-[clamp(150px,90vw,360px)]",
];

//create an array of player info styles
const playerInfoStyling = [
  "text-xs",
  "rounded-full",
  "text-neutral-400",
  "text-justify",
];

// grab my grid-container from the DOM
const gameGrid = document.getElementById("grid-container") as Element;

// grab my player
const currentPlayerElement = document.getElementById(
  "current-player"
) as Element;

const currentScorePlayers = document.getElementById("score-players") as Element;

// grab my button
const resetButton = document.getElementById("reset-button") as Element;

// make players[]
const players: Array<Player> = [
  { name: "Player1", symbol: "X", score: 0 },
  { name: "Player2", symbol: "O", score: 0 },
];

// game initial state

// turns are set to 0 as default
let turn = 0;

// keeps track of whether the game has reached the end, and that we must stop the game from being further played
let gameEndState = false;

// we display on top the user whose turn is it, if a player won the game or if it was a draw.
const currentPlayerText = `Next:<br> ${players[0].name}`;
currentPlayerElement.innerHTML = currentPlayerText;

// create a function that will display players current information
function infoPlayersDisplay() {
  for (let player in players) {
    // create paragraph
    const playerInfo = document.createElement("p");

    currentScorePlayers.appendChild(playerInfo);

    playerInfo.innerHTML = `${players[player].name}<br>Symbol: ${players[player].symbol} <br>Score: ${players[player].score}`;

    playerInfo.classList.add(...playerInfoStyling);
  }
}

// tracking the game from the initial state
let gameState: Record<string, CellState> = {};

const winConditions = [
  ["0-0", "0-1", "0-2"],
  ["1-0", "1-1", "1-2"],
  ["2-0", "2-1", "2-2"],
  ["0-0", "1-0", "2-0"],
  ["0-1", "1-1", "1-2"],
  ["2-0", "2-1", "2-2"],
  ["0-0", "1-1", "2-2"],
  ["0-2", "1-1", "2-0"],
];

function didWin() {
  for (const winCondition of winConditions) {
    const [cell1, cell2, cell3] = winCondition.map((id) => gameState[id]);

    const winner =
      cell1.markedBy != null &&
      cell2.markedBy != null &&
      cell3.markedBy != null &&
      cell1.markedBy == cell2.markedBy &&
      cell2.markedBy == cell3.markedBy &&
      cell3.markedBy == cell1.markedBy;

    if (winner) {
      displayWinner();
      return true;
    }
  }
}

// add some styling to the grid-container
gameGrid?.classList.add(...gridStyling);

// create function that displays a congratulatory message to the winner
function displayWinner() {
  const winMessage = `${players[turn].name}<br>won!!`;
  currentPlayerElement.innerHTML = winMessage;
}

// create a function that will create a grid
function makeMyGrid() {
  for (let row = 0; row < gridSize; row++) {
    for (let column = 0; column < gridSize; column++) {
      // create grid cell
      const cell = document.createElement("div");

      // add some styling to the cell
      cell.classList.add(...gridCellStyling);

      // generate the ids
      const id = coordToId([row, column]);

      // attach ids to the cells
      cell.id = id;

      // initialize the cell state, so that this can be tracked. It is also possible to do it when adding event listeners for player symbols of "x" or "o"
      gameState[id] = {
        markedBy: null,
        element: cell,
      };

      // append the child to the DOM
      gameGrid?.appendChild(cell);

      // add event listeners to the cells
      cell.addEventListener("click", (event) => {
        if (!gameEndState) {
          // need to know whose turn is it
          const currentPlayer = players[turn];

          // whichever player's turn it is, add their symbol to the "markedBy" key for each specific cell
          const cellState = gameState[id];

          const isMarkedBy = Boolean(cellState.markedBy);

          if (!isMarkedBy) {
            cellState.markedBy = currentPlayer.name;

            // update the cell to render the symbol on the tic tac toe
            cell.innerHTML = `<div class="flex justify-center items-center h-full"><p class="text-4xl">${currentPlayer.symbol}</p></div>`;

            // bring the function for checking win condition
            const gameWinner = didWin();

            if (gameWinner) {
              players[turn].score++;
              currentScorePlayers.innerHTML = "";
              infoPlayersDisplay();
              gameEndState = true;
              return;
            }

            // go to the next turn, and one can always wrap around
            turn = (turn + 1) % players.length;

            const nextPlayer = players[turn];

            currentPlayerElement.innerHTML = `Next:<br> ${nextPlayer.name}`;

            resetButton.addEventListener("click", () => {
              resetGrid();
              makeMyGrid();
              infoPlayersDisplay();
            });
          }
        }
      });
    }
  }
}

function resetGrid() {
  /* while (gameGrid.lastChild) {
    gameGrid.removeChild(gameGrid.lastChild);
  } */

  gameGrid.innerHTML = "";
  currentScorePlayers.innerHTML = "";
  gameEndState = false;
  turn = 0;
  currentPlayerElement.innerHTML = currentPlayerText;
}

// call the function to create the grid
makeMyGrid();
infoPlayersDisplay();
