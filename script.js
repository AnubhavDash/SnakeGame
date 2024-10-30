const boardSize = 20; // 20x20 grid
const gameBoard = document.getElementById('game-board');
const scoreDisplay = document.getElementById('score');
const resetButton = document.getElementById('reset-button');
let snake = [{ x: 9, y: 9 }];
let food = {};
let score = 0;
let direction = { x: 0, y: 0 }; // Initial direction
let gameInterval;

// Create grid cells
for (let i = 0; i < boardSize * boardSize; i++) { // 20x20 grid = 400 cells
    const gridCell = document.createElement('div');
    gridCell.classList.add('grid-cell');
    gameBoard.appendChild(gridCell);
}

// Function to reset the game
function resetGame() {
    clearInterval(gameInterval);
    snake = [{ x: 9, y: 9 }];
    score = 0;
    scoreDisplay.textContent = "Score: 0";
    generateFood();
    direction = { x: 0, y: 0 };
    startGame();
}

// Function to start the game
function startGame() {
    gameInterval = setInterval(gameLoop, 100);
}

// Function to generate food at a random location
function generateFood() {
    food.x = Math.floor(Math.random() * boardSize);
    food.y = Math.floor(Math.random() * boardSize);
}

// Function to update the game state
function gameLoop() {
    moveSnake();
    if (checkCollision()) {
        alert("Game Over! Your score was: " + score);
        resetGame();
    }
    updateDisplay();
}

// Function to move the snake
function moveSnake() {
    const head = { ...snake[0] };
    head.x += direction.x;
    head.y += direction.y;

    // Check if food is eaten
    if (head.x === food.x && head.y === food.y) {
        score++;
        generateFood();
    } else {
        snake.pop(); // Remove the tail
    }
    snake.unshift(head); // Add new head
}

// Function to check collisions
function checkCollision() {
    const head = snake[0];
    return (
        head.x < 0 || head.x >= boardSize || // Wall collision
        head.y < 0 || head.y >= boardSize || // Wall collision
        snake.slice(1).some(segment => segment.x === head.x && segment.y === head.y) // Self collision
    );
}

// Function to update the display
function updateDisplay() {
    // Clear the board
    const cells = gameBoard.getElementsByClassName('grid-cell');
    Array.from(cells).forEach(cell => cell.style.backgroundColor = '');

    // Draw snake
    snake.forEach(segment => {
        const index = segment.y * boardSize + segment.x;
        cells[index].style.backgroundColor = '#00ff00'; // Snake color
    });

    // Draw food
    const foodIndex = food.y * boardSize + food.x;
    cells[foodIndex].style.backgroundColor = '#ff0000'; // Food color

    // Update score
    scoreDisplay.textContent = "Score: " + score;
}

// Event listeners for controls
document.addEventListener('keydown', (event) => {
    switch (event.key) {
        case 'ArrowUp':
            if (direction.y === 0) direction = { x: 0, y: -1 };
            break;
        case 'ArrowDown':
            if (direction.y === 0) direction = { x: 0, y: 1 };
            break;
        case 'ArrowLeft':
            if (direction.x === 0) direction = { x: -1, y: 0 };
            break;
        case 'ArrowRight':
            if (direction.x === 0) direction = { x: 1, y: 0 };
            break;
    }
});

// Reset button functionality
resetButton.addEventListener('click', resetGame);

// Start the game for the first time
resetGame();
