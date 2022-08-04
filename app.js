const tileDisplay = document.querySelector(".tile-container");
const keyboard = document.querySelector(".key-container");
const messageDisplay = document.querySelector(".message-container");

let wordle;

const getWordle = () => {
  const apiUrl = "https://wordle-server-duy.herokuapp.com/word";
  fetch(apiUrl)
    .then((response) => response.json())
    .then((data) => {
      wordle = data[0];
      console.log(wordle);
    })
    .catch((error) => console.log(error));
};
getWordle();
const keys = [
  "q",
  "w",
  "e",
  "r",
  "t",
  "y",
  "u",
  "i",
  "o",
  "p",
  "a",
  "s",
  "d",
  "f",
  "g",
  "h",
  "j",
  "k",
  "l",
  "enter",
  "z",
  "x",
  "c",
  "v",
  "b",
  "n",
  "m",
  "<<",
];

const guessRows = [
  ["", "", "", "", ""],
  ["", "", "", "", ""],
  ["", "", "", "", ""],
  ["", "", "", "", ""],
  ["", "", "", "", ""],
  ["", "", "", "", ""],
];
let currentRow = 0;
let currentTile = 0;
let isGameOver = false;

guessRows.forEach((row, index) => {
  const rowEl = document.createElement("div");
  rowEl.setAttribute("id", `row-${index}`);

  row.forEach((letter, guessIndex) => {
    const tileEl = document.createElement("div");
    tileEl.setAttribute("id", `row-${index}_tile-${guessIndex}`);
    tileEl.classList.add("tile");
    rowEl.append(tileEl);
  });
  tileDisplay.appendChild(rowEl);
});

const addLetter = (key) => {
  if (currentTile < 5 && currentRow < 6) {
    const tile = document.getElementById(
      `row-${currentRow}_tile-${currentTile}`
    );
    tile.textContent = key;
    guessRows[currentRow][currentTile] = key;
    tile.setAttribute("data", key);
    currentTile++;
  }
};

const deleteLetter = () => {
  if (currentTile > 0) {
    currentTile--;
    const tile = document.getElementById(
      `row-${currentRow}_tile-${currentTile}`
    );
    tile.textContent = "";
    guessRows[currentRow][currentTile] = "";
    tile.setAttribute("data", "");
  }
};

document.addEventListener("keydown", (e) => {
  if (isGameOver) return;
  if (keys.includes(e.key)) {
    handleClick(e.key);
  }
  if (e.key === "Backspace") {
    handleClick("<<");
  }
  if (e.key === "Enter") {
    handleClick("enter");
  }
});

const handleClick = (key) => {
  if (key === "<<") {
    deleteLetter();
    return;
  }
  if (key === "enter") {
    checkRow();
    return;
  }
  addLetter(key);
};
keys.forEach((key) => {
  const btnEl = document.createElement("button");
  btnEl.textContent = key.toUpperCase();
  btnEl.classList.add("key");
  btnEl.setAttribute("id", key);
  btnEl.addEventListener("click", () => handleClick(key));
  keyboard.append(btnEl);
});

const checkRow = () => {
  const wordGuessed = guessRows[currentRow].join("");
  if (currentTile == 5) {
    flipTitle();
    if (wordle == wordGuessed) {
      showMessage("Congratulations! The word was " + wordle.toUpperCase());
      isGameOver = true;
      return;
    } else {
      if (currentRow >= 5) {
        isGameOver = true;
        showMessage("Game Over! The word was " + wordle.toUpperCase());
        return;
      }
      if (currentRow < 5) {
        currentRow++;
        currentTile = 0;
      }
    }
  }
};

const showMessage = (msg) => {
  const messageEl = document.createElement("p");
  messageEl.textContent = msg;
  messageDisplay.append(messageEl);
  setTimeout(() => messageDisplay.removeChild(messageEl), 5000);
};

const addColorToKey = (key, color) => {
  const keyEl = document.getElementById(key);
  keyEl.classList.add(color);
};

const flipTitle = () => {
  const rowTiles = document.getElementById(`row-${currentRow}`).childNodes;
  let checkWordle = wordle;
  const guess = [];

  rowTiles.forEach((tile) => {
    guess.push({ letter: tile.getAttribute("data"), color: "gray" });
  });

  guess.forEach((guess) => {
    if (checkWordle.includes(guess.letter)) {
      guess.color = "orange";
      checkWordle = checkWordle.replace(guess.letter, "");
    }
  });

  guess.forEach((guess, index) => {
    if (guess.letter == wordle[index]) {
      guess.color = "cyan";
      checkWordle = checkWordle.replace(guess.letter, "");
    }
  });

  rowTiles.forEach((tile, index) => {
    setTimeout(() => {
      tile.classList.add("tile-flip");
      tile.classList.add(guess[index].color);
      addColorToKey(guess[index].letter, guess[index].color);
    }, 500 * index);
  });
};
