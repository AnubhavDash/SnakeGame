const board = document.getElementById('game-board');
const scoreDisplay = document.getElementById('score');
const resetButton = document.getElementById('reset-button');

const boardSize = 20; // Number of squares in one dimension
const snakeSize = 20; // Size of each segment of the snake
let snake = [{ x: 9 * snakeSize, y: 9 * snakeSize }];
let food = {};
let direction = { x: snakeSize, y: 0 }; // Initial direction to the right
let score = 0;
let gameInterval;
let isGameRunning = true;

function createFood() {
    food = {
        x: Math.floor(Math.random() * boardSize) * snakeSize,
        y: Math.floor(Math.random() * boardSize) * snakeSize
    };
    // Ensure food is not generated on the snake's body
    for (let segment of snake) {
        if (segment.x === food.x && segment.y === food.y) {
            createFood();
            return;
        }
    }
}

function drawSnake() {
    board.innerHTML = ''; // Clear the board
    for (let segment of snake) {
        const snakeElement = document.createElement('div');
        snakeElement.style.left = `${segment.x}px`;
        snakeElement.style.top = `${segment.y}px`;
        snakeElement.className = 'snake';
        board.appendChild(snakeElement);
    }
}

function drawFood() {
    const foodElement = document.createElement('div');
    foodElement.style.left = `${food.x}px`;
    foodElement.style.top = `${food.y}px`;
    foodElement.className = 'food';
    board.appendChild(foodElement);
}

function update() {
    const newHead = {
        x: snake[0].x + direction.x,
        y: snake[0].y + direction.y
    };

    // Check for collisions
    if (
        newHead.x < 0 ||
        newHead.x >= board.clientWidth ||
        newHead.y < 0 ||
        newHead.y >= board.clientHeight ||
        snake.some(segment => segment.x === newHead.x && segment.y === newHead.y)
    ) {
        isGameRunning = false;
        clearInterval(gameInterval);
        alert('Game Over! Your score: ' + score);
        return;
    }

    // Check if snake has eaten food
    if (newHead.x === food.x && newHead.y === food.y) {
        score += 10;
        createFood();
    } else {
        snake.pop(); // Remove the last segment if no food is eaten
    }

    snake.unshift(newHead); // Add new head to the snake
    scoreDisplay.innerText = 'Score: ' + score;
    drawSnake();
    drawFood();
}

function startGame() {
    score = 0;
    snake = [{ x: 9 * snakeSize, y: 9 * snakeSize }];
    direction = { x: snakeSize, y: 0 }; // Reset direction
    isGameRunning = true;
    createFood();
    drawSnake();
    drawFood();
    clearInterval(gameInterval);
    gameInterval = setInterval(update, 100); // Update the game every 100ms
}

document.addEventListener('keydown', (event) => {
    switch (event.key) {
        case 'ArrowUp':
            if (direction.y === 0) direction = { x: 0, y: -snakeSize };
            break;
        case 'ArrowDown':
            if (direction.y === 0) direction = { x: 0, y: snakeSize };
            break;
        case 'ArrowLeft':
            if (direction.x === 0) direction = { x: -snakeSize, y: 0 };
            break;
        case 'ArrowRight':
            if (direction.x === 0) direction = { x: snakeSize, y: 0 };
            break;
        case ' ': // Space bar to stop the snake
            direction = { x: 0, y: 0 };
            break;
    }
});

resetButton.addEventListener('click', startGame);
startGame();
