const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d'); // Use '2d' for a 2D game
const scoreDisplay = document.getElementById('score');

// Game variables
const gridSize = 20;         // Size of each grid square
let snake = [{ x: 10, y: 10 }]; // Initial snake position
let food = generateFood();      // Initial food position
let direction = 'right';      // Initial direction
let score = 0;
let gameSpeed = 100;          // milliseconds per frame (lower = faster)
let gameInterval;
let gameStarted = false;      // Track if the game has started


// Function to generate food at a random location
function generateFood() {
    let foodX, foodY;
    do {
        foodX = Math.floor(Math.random() * (canvas.width / gridSize));
        foodY = Math.floor(Math.random() * (canvas.height / gridSize));
    } while (snake.some(segment => segment.x === foodX && segment.y === foodY)); // Avoid spawning food on the snake

    return { x: foodX, y: foodY };
}




// Function to update the game state
function update() {
  if (gameStarted) {
    moveSnake();

    if (checkCollision()) {
      gameOver();
      return;
    }

    if (eatFood()) {
      score++;
      scoreDisplay.textContent = score;
      food = generateFood();
    }
  }

  draw(); // Render the game after each update
}

// Function to draw everything on the canvas
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas

  if (!gameStarted) {
    // Show start message
    ctx.fillStyle = 'black';
    ctx.font = '20px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Press any arrow key to start', canvas.width / 2, canvas.height / 2);
  }

  // Draw the snake
  snake.forEach(segment => {
    ctx.fillStyle = 'green';
    ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize, gridSize);
    ctx.strokeStyle = 'black'; // Optional:  Add a border to the snake segments
    ctx.strokeRect(segment.x * gridSize, segment.y * gridSize, gridSize, gridSize);
  });

  // Draw the food
  ctx.fillStyle = 'red';
  ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize, gridSize);
}


// Function to move the snake
function moveSnake() {
  const head = { ...snake[0] }; // Copy the head

  switch (direction) {
    case 'up':    head.y--; break;
    case 'down':  head.y++; break;
    case 'left':  head.x--; break;
    case 'right': head.x++; break;
  }

  snake.unshift(head);  // Add the new head to the beginning

  if (!eatFood()) {
    snake.pop();       // Remove the tail if we didn't eat food
  }
}


// Function to check for collisions (with walls or self)
function checkCollision() {
  const head = snake[0];

  // Wall collision
  if (head.x < 0 || head.x >= canvas.width / gridSize || head.y < 0 || head.y >= canvas.height / gridSize) {
    return true;
  }

  // Self-collision
  for (let i = 1; i < snake.length; i++) {
    if (head.x === snake[i].x && head.y === snake[i].y) {
      return true;
    }
  }

  return false;
}


// Function to check if the snake ate the food
function eatFood() {
  if (snake[0].x === food.x && snake[0].y === food.y) {
    return true;
  }
  return false;
}


// Function to handle game over
function gameOver() {
  clearInterval(gameInterval);
  alert(`Game Over! Your score: ${score}`);
  // You might want to add a "restart" button here
  snake = [{ x: 10, y: 10 }]; // Reset snake position
  food = generateFood();
  direction = 'right';
  score = 0;
  gameStarted = false;
  scoreDisplay.textContent = score;
  gameInterval = setInterval(update, gameSpeed); //restart the game
}


// Event listener for keyboard input
document.addEventListener('keydown', (event) => {
  if (!gameStarted && ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)) {
    gameStarted = true;
  }
  
  switch (event.key) {
    case 'ArrowUp':    if (direction !== 'down')  direction = 'up';    break;
    case 'ArrowDown':  if (direction !== 'up')    direction = 'down';  break;
    case 'ArrowLeft':  if (direction !== 'right') direction = 'left';  break;
    case 'ArrowRight': if (direction !== 'left')  direction = 'right'; break;
  }
});

// Start the game loop
gameInterval = setInterval(update, gameSpeed);