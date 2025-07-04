document.addEventListener('DOMContentLoaded', () => {
  candyCrushGame();
});

function candyCrushGame() {
  const grid            = document.querySelector('.grid');
  const scoreDisplay    = document.getElementById('score');
  const timerDisplay    = document.getElementById('timer');
  const modeSelection   = document.getElementById('modeSelection');
  const endlessButton   = document.getElementById('endlessMode');
  const timedButton     = document.getElementById('timedMode');
  const changeModeBtn   = document.getElementById('changeMode');

  const width   = 8;
  const squares = [];
  let score         = 0;
  let currentMode   = null;
  let timeLeft      = 0;
  let gameInterval  = null;
  let timerInterval = null;
  let playerHasMoved = false; // Naya flag banaya: jab tak player first move na kare, score nahi milega
const matchSound = new Audio('assets/rising.mp3'); // Naya audio object add kiya

function playMatchSound() {
  matchSound.pause();         //  Pehle jo sound chal raha ha usko rok raha ha
  matchSound.currentTime = 0; //  wapas 0
  matchSound.play();          //  phir se play
}

  const candyColors = [
    'url(https://raw.githubusercontent.com/arpit456jain/Amazing-Js-Projects/master/Candy%20Crush/utils/red-candy.png)',
    'url(https://raw.githubusercontent.com/arpit456jain/Amazing-Js-Projects/master/Candy%20Crush/utils/blue-candy.png)',
    'url(https://raw.githubusercontent.com/arpit456jain/Amazing-Js-Projects/master/Candy%20Crush/utils/green-candy.png)',
    'url(https://raw.githubusercontent.com/arpit456jain/Amazing-Js-Projects/master/Candy%20Crush/utils/yellow-candy.png)',
    'url(https://raw.githubusercontent.com/arpit456jain/Amazing-Js-Projects/master/Candy%20Crush/utils/orange-candy.png)',
    'url(https://raw.githubusercontent.com/arpit456jain/Amazing-Js-Projects/master/Candy%20Crush/utils/purple-candy.png)'
  ];

  function createBoard() {
    grid.innerHTML = '';
    squares.length = 0;

    for (let i = 0; i < width * width; i++) {
      const square = document.createElement('div');
      square.setAttribute('draggable', true);
      square.setAttribute('id', i);

      const colourIdx = Math.floor(Math.random() * candyColors.length);
      square.style.backgroundImage = candyColors[colourIdx];

      grid.appendChild(square);
      squares.push(square);
    }

    squares.forEach(sq => {
      sq.addEventListener('dragstart', dragStart);
      sq.addEventListener('dragend',   dragEnd);
      sq.addEventListener('dragover',  dragOver);
      sq.addEventListener('dragenter', dragEnter);
      sq.addEventListener('dragleave', dragLeave);
      sq.addEventListener('drop',      dragDrop);
    });
  }

  let colorDragged, colorReplaced, idDragged, idReplaced;

  function dragStart() {
    colorDragged = this.style.backgroundImage;
    idDragged    = Number(this.id);
  }
  function dragOver(e)  { e.preventDefault(); }
  function dragEnter(e) { e.preventDefault(); }
  function dragLeave()  {}

  function dragDrop() {
    colorReplaced = this.style.backgroundImage;
    idReplaced    = Number(this.id);
    this.style.backgroundImage            = colorDragged;
    squares[idDragged].style.backgroundImage = colorReplaced;
  }

  function dragEnd() {
    const validMoves = [
      idDragged - 1,
      idDragged + 1,
      idDragged - width,
      idDragged + width
    ];
    const valid = validMoves.includes(idReplaced);

    if (idReplaced && valid) {
      playerHasMoved = true;   // Jaise hi player ka first valid move hota hai, flag true ho jata hai
      idReplaced     = null;
    } else if (idReplaced && !valid) {
      squares[idReplaced].style.backgroundImage = colorReplaced;
      squares[idDragged].style.backgroundImage  = colorDragged;
    } else {
      squares[idDragged].style.backgroundImage  = colorDragged;
    }
  }

  function moveIntoSquareBelow() {
    for (let i = 0; i < width; i++) {
      if (squares[i].style.backgroundImage === '') {
        const rand = Math.floor(Math.random() * candyColors.length);
        squares[i].style.backgroundImage = candyColors[rand];
      }
    }
    for (let i = 0; i < width * (width - 1); i++) {
      if (squares[i + width].style.backgroundImage === '') {
        squares[i + width].style.backgroundImage = squares[i].style.backgroundImage;
        squares[i].style.backgroundImage = '';
      }
    }
  }

// Saare match check functions mein ek naya parameter add kiya hai `addScore`
  // Agar player move nahi karega to ye false hoga, to score add nahi hoga

  function checkRowForFour(addScore = true) {
    for (let i = 0; i < 60; i++) {
      if (i % width > width - 4) continue;
      const row = [i, i + 1, i + 2, i + 3];
      const colour = squares[i].style.backgroundImage;
      if (
        colour &&
        row.every(idx => squares[idx].style.backgroundImage === colour)
      ) {
        if (addScore) {
          score += 4;
          scoreDisplay.textContent = score;
 matchSound.currentTime = 0; // Dobara rewind na ho
  matchSound.play(); 
        }
        row.forEach(idx => squares[idx].style.backgroundImage = '');
      }
    }
  }

  function checkColumnForFour(addScore = true) {
    for (let i = 0; i < 40; i++) {
      const col = [i, i + width, i + 2 * width, i + 3 * width];
      const colour = squares[i].style.backgroundImage;
      if (
        colour &&
        col.every(idx => squares[idx].style.backgroundImage === colour)
      ) {
        if (addScore) {
          score += 4;
          scoreDisplay.textContent = score;
        }
        col.forEach(idx => squares[idx].style.backgroundImage = '');
      }
    }
  }

  function checkRowForThree(addScore = true) {
let found = false; 
    for (let i = 0; i < 62; i++) {

      if (i % width > width - 3) continue;
      const row = [i, i + 1, i + 2];
      const colour = squares[i].style.backgroundImage;
      if (
        colour &&
        row.every(idx => squares[idx].style.backgroundImage === colour)
      ) {
        if (addScore) {
          score += 3;
          scoreDisplay.textContent = score;
matchSound.currentTime = 0; 
        matchSound.play();  
        }
        row.forEach(idx => squares[idx].style.backgroundImage = '');
 found = true; 
      }
    }
 return found;
  }

  function checkColumnForThree(addScore = true) {
    for (let i = 0; i < 48; i++) {
      const col = [i, i + width, i + 2 * width];
      const colour = squares[i].style.backgroundImage;
      if (
        colour &&
        col.every(idx => squares[idx].style.backgroundImage === colour)
      ) {
        if (addScore) {
          score += 3;
          scoreDisplay.textContent = score;
        }
        col.forEach(idx => squares[idx].style.backgroundImage = '');
      }
    }
  }

  function gameLoop() {

    const addScore = playerHasMoved; // Pehle move ke baad hi score milega
    let matchHua = false;      // Iss tick me kam se kam 1 match mila ya nahi

    
  if (checkRowForFour(addScore))     matchHua = true;
  if (checkColumnForFour(addScore))  matchHua = true;
  
  if (checkRowForThree(addScore))    matchHua = true;
  if (checkColumnForThree(addScore)) matchHua = true;

  if (matchHua && addScore) playMatchSound(); // Ek hi dafa sound

  moveIntoSquareBelow();

  }

  function startGame(mode) {
    currentMode = mode;
    modeSelection.style.display           = 'none';
    grid.style.display                    = 'flex';
    scoreDisplay.parentElement.style.display = 'flex';

    createBoard();

    score = 0;
    scoreDisplay.textContent = score;
    playerHasMoved = false; // Game start pe false set kiya

    clearInterval(gameInterval);
    clearInterval(timerInterval);
    gameInterval = setInterval(gameLoop, 100);

    if (mode === 'timed') {
      timeLeft = 120;
      updateTimerDisplay();
      timerInterval = setInterval(() => {
        timeLeft--;
        updateTimerDisplay();
        if (timeLeft <= 0) {
          clearInterval(timerInterval);
          endGame();
        }
      }, 1000);
    } else {
      timerDisplay.textContent = '';
    }
  }

  function updateTimerDisplay() {
    if (currentMode === 'timed') {
      const min = Math.floor(timeLeft / 60);
      const sec = String(timeLeft % 60).padStart(2, '0');
      timerDisplay.textContent = `Time Left: ${min}:${sec}`;
    } else {
      timerDisplay.textContent = '';
    }
  }

  function endGame() {
    clearInterval(gameInterval);
    squares.forEach(sq => sq.setAttribute('draggable', false));
    alert(`Time's Up! Your score is ${score}`);
  }

  function changeMode() {
    clearInterval(gameInterval);
    clearInterval(timerInterval);

    score = 0;
    scoreDisplay.textContent = score;
    playerHasMoved = false; // Reset flag jab mode change ho

    grid.style.display                    = 'none';
    scoreDisplay.parentElement.style.display = 'none';
    modeSelection.style.display           = 'flex';
  }

  endlessButton.addEventListener('click', () => startGame('endless'));
  timedButton.addEventListener('click',   () => startGame('timed'));
  changeModeBtn.addEventListener('click', changeMode);
}
