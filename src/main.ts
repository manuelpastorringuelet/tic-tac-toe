import "./style.css";

// 1. type for coordinates, to track each single cell
type Coordinates = [number, number];

// 2. type for player: name | symbol | score
type Player = {
  name: string;
  symbol: "x" | "o"; // union type
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
const gridCellStyling = ["aspect-square", "bg-green-200"];

//create an array of grid-container styles
const gridStyling = [
  "grid",
  "grid-cols-3",
  "bg-neutral-900",
  "gap-1",
  "w-2/3",
  "max-w-[480px]",
];

// grab my grid-container from the DOM
const gameGrid = document.getElementById("grid-container") as Element;

// grab my player
const currentPlayerElement = document.getElementById(
  "current-player"
) as Element;

// grab my button
const resetButton = document.getElementById("reset-button") as Element;

// make players[]
const players: Array<Player> = [
  { name: "Player1", symbol: "x", score: 0 },
  { name: "Player2", symbol: "o", score: 0 },
];

// game initial state

// turns are set to 0 as default
let turn = 0;

// keeps track of whether the game has reached the end, and that we must stop the game from being further played
let gameEndState = false;

// we display on top the user whose turn is it, if a player won the game or if it was a draw.
currentPlayerElement.textContent = `The current player is: ${players[0].name}`;

// tracking the game from the initial state
let gameState: Record<string, CellState> = {};

const winConditions = [
  ["0-0", "0-1", "0-2"],
  ["1-0", "1-1", "1-2"],
  ["2-0", "2-1", "2-2"],
  ["0-0", "1-0", "2-0"],
  ["1-0", "1-1", "1-2"],
  ["2-0", "2-1", "2-2"],
  ["0-0", "1-1", "2-2"],
  ["0-2", "1-1", "2-0"],
];

function winOrNot() {
  for (const winCondition in winConditions) {
    return true;
  }
  return false;
}
winOrNot();

// add some styling to the grid-container
gameGrid?.classList.add(...gridStyling);

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
            cell.innerHTML = `<div class="flex justify-center items-center h-full"><p class="text-5xl">${currentPlayer.symbol}</p></div>`;

            // bring the function for checking win condition

            // go to the next turn, and one can always wrap around
            turn = (turn + 1) % players.length;

            const nextPlayer = players[turn];

            currentPlayerElement.textContent = `The current player is: ${nextPlayer.name}`;

            resetButton.addEventListener("click", () => {
              cell.innerHTML = "";
            });
          }
        }
        console.log(`click ${id}`);
      });
    }
  }
}

// call the function to create the grid
makeMyGrid();
