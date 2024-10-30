let gameBoard = document.getElementById('game-board');
let scoreDisplay = document.getElementById('score');
let gameOverOverlay = document.getElementById('game-over');
let finalScoreDisplay = document.getElementById('final-score');
let gameInterval;
let gridSize = 20;
let snake = [{ x: 10, y: 10 }];
let food = { x: 15, y: 15 };
let direction = { x: 0, y: 0 };
let score = 0;
let difficulty = 100;
let touchStartX = 0, touchStartY = 0;

// Initialize the game
function initGame() {
    document.addEventListener('keydown', changeDirection);
    document.addEventListener('touchstart', startTouch, false);
    document.addEventListener('touchmove', moveTouch, false);
    placeFood();
    draw();
    gameInterval = setInterval(updateGame, difficulty);
}

// Set grid size
function setGridSize(size) {
    gridSize = parseInt(size);
    gameBoard.style.gridTemplateColumns = `repeat(${gridSize}, 1fr)`;
    restartGame();
}

// Set difficulty
function setDifficulty(value) {
    difficulty = parseInt(value);
    clearInterval(gameInterval);
    gameInterval = setInterval(updateGame, difficulty);
}

// Touch event handlers
function startTouch(e) {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
}

function moveTouch(e) {
    if (!touchStartX || !touchStartY) return;
    let touchEndX = e.touches[0].clientX;
    let touchEndY = e.touches[0].clientY;
    let diffX = touchStartX - touchEndX;
    let diffY = touchStartY - touchEndY;

    if (Math.abs(diffX) > Math.abs(diffY)) {
        if (diffX > 0 && direction.x === 0) changeDirection({ key: 'ArrowLeft' });
        else if (diffX < 0 && direction.x === 0) changeDirection({ key: 'ArrowRight' });
    } else {
        if (diffY > 0 && direction.y === 0) changeDirection({ key: 'ArrowUp' });
        else if (diffY < 0 && direction.y === 0) changeDirection({ key: 'ArrowDown' });
    }
    touchStartX = 0;
    touchStartY = 0;
}

// Update game state
function updateGame() {
    moveSnake();
    if (checkCollision()) {
        endGame();
        return;
    }
    if (isEatingFood()) {
        score++;
        scoreDisplay.textContent = `Score: ${score}`;
        growSnake();
        placeFood();
        snake[0].classList.add('eat'); // Trigger flash animation
    }
    draw();
}

// Draw game elements
function draw() {
    gameBoard.innerHTML = '';
    snake.forEach(segment => {
        let snakeElement = document.createElement('div');
        snakeElement.style.gridRowStart = segment.y;
        snakeElement.style.gridColumnStart = segment.x;
        snakeElement.classList.add('snake');
        gameBoard.appendChild(snakeElement);
    });
    let foodElement = document.createElement('div');
    foodElement.style.gridRowStart = food.y;
    foodElement.style.gridColumnStart = food.x;
    foodElement.classList.add('food');
    gameBoard.appendChild(foodElement);
}

// Move snake
function moveSnake() {
    const newHead = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };
    snake.unshift(newHead);
    snake.pop();
}

// Check collision
function checkCollision() {
    if (snake[0].x < 1 || snake[0].x > gridSize || snake[0].y < 1 || snake[0].y > gridSize) return true;
    for (let i = 1; i < snake.length; i++) {
        if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) return true;
    }
    return false;
}

// Eating food and flash animation
function isEatingFood() {
    return snake[0].x === food.x && snake[0].y === food.y;
}

// Place food at random position
function placeFood() {
    food = {
        x: Math.floor(Math.random() * gridSize) + 1,
        y: Math.floor(Math.random() * gridSize) + 1
    };
}

// Grow snake
function growSnake() {
    snake.push({ ...snake[snake.length - 1] });
}

// Restart game
function restartGame() {
    snake = [{ x: 10, y: 10 }];
    direction = { x: 0, y: 0 };
    score = 0;
    scoreDisplay.textContent = 'Score: 0';
    gameOverOverlay.style.display = 'none';
    placeFood();
    clearInterval(gameInterval);
    gameInterval = setInterval(updateGame, difficulty);
}

// End game
function endGame() {
    clearInterval(gameInterval);
    finalScoreDisplay.textContent = `Final Score: ${score}`;
    gameOverOverlay.style.display = 'flex';
}

// Change direction based on key input
function changeDirection(event) {
    const keyPressed = event.key;
    if (keyPressed === 'ArrowUp' && direction.y === 0) direction = { x: 0, y: -1 };
    else if (keyPressed === 'ArrowDown' && direction.y === 0) direction = { x: 0, y: 1 };
    else if (keyPressed === 'ArrowLeft' && direction.x === 0) direction = { x: -1, y: 0 };
    else if (keyPressed === 'ArrowRight' && direction.x === 0) direction = { x: 1, y: 0 };
}

// Initialize game
initGame();
