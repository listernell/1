// Get the canvas element
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// Set the canvas dimensions
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Define the dinosaur character
const dino = {
  x: 80,
  y: 350,
  width: 50,
  height: 50,
  jumpForce: 10,
  gravity: 0.5,
  velocity: 0,
  isJumping: false,
  speed: 5
};

// Define the ground
const ground = {
  x: 0,
  y: 400,
  width: canvas.width,
  height: 20
};

// Define the obstacles
let obstacles = [];
const obstacleWidth = 30;
const obstacleHeight = 30;
const minGap = 200;
const maxGap = 500;

// Track game state
let gameOver = false;

// Track score
let score = 0;

// Draw the game elements
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw ground
  ctx.fillStyle = 'green';
  ctx.fillRect(ground.x, ground.y, ground.width, ground.height);

  // Draw dino
  ctx.fillStyle = 'brown';
  ctx.fillRect(dino.x, dino.y, dino.width, dino.height);

  // Draw obstacles
  for (let i = 0; i < obstacles.length; i++) {
    ctx.fillStyle = 'gray';
    ctx.fillRect(obstacles[i].x, obstacles[i].y, obstacleWidth, obstacleHeight);
  }

  // Draw score
  ctx.fillStyle = 'black';
  ctx.font = '24px sans-serif';
  ctx.fillText(`Score: ${score}`, 20, 40);

  // Draw game over message
  if (gameOver) {
    ctx.fillStyle = 'red';
    ctx.font = '48px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Game Over', canvas.width / 2, canvas.height / 2);
  }
}

// Update the game state
function update() {
  if (gameOver) return;

  if (dino.isJumping) {
    dino.velocity -= dino.gravity;
    dino.y -= dino.velocity;
    if (dino.y + dino.height > ground.y) {
      dino.y = ground.y - dino.height;
      dino.isJumping = false;
    }
  }

  // Move obstacles
  for (let i = 0; i < obstacles.length; i++) {
    obstacles[i].x -= dino.speed;

    // Check if dino passed an obstacle without collision
    if (obstacles[i].x + obstacleWidth < dino.x && !obstacles[i].passed) {
      score += 1;
      obstacles[i].passed = true; // Mark obstacle as passed
    }

    // Remove off-screen obstacles
    if (obstacles[i].x < -obstacleWidth) {
      obstacles.splice(i, 1);
      i--; // Adjust index after removal
    }

    // Check collision
    if (checkCollision(dino, obstacles[i])) {
      gameOver = true;
      setTimeout(resetGame, 3000);
    }
  }

  // Generate new obstacles
  if (obstacles.length === 0 || obstacles[obstacles.length - 1].x < canvas.width - minGap) {
    const newObstacle = {
      x: canvas.width + Math.random() * (maxGap - minGap) + minGap,
      y: ground.y - obstacleHeight,
      width: obstacleWidth,
      height: obstacleHeight,
      passed: false // Track if the obstacle has been passed
    };
    obstacles.push(newObstacle);
  }
}

// Check collision between dino and obstacle
function checkCollision(dino, obstacle) {
  return (
    dino.x < obstacle.x + obstacle.width &&
    dino.x + dino.width > obstacle.x &&
    dino.y < obstacle.y + obstacle.height &&
    dino.y + dino.height > obstacle.y
  );
}

// Reset game
function resetGame() {
  dino.x = 80;
  dino.y = ground.y - dino.height;
  dino.isJumping = false;
  obstacles = [];
  gameOver = false;
  score = 0; // Reset score
}

// Handle mouse click
canvas.addEventListener('click', () => {
  if (!dino.isJumping && !gameOver) {
    dino.velocity = dino.jumpForce;
    dino.isJumping = true;
  }
});

// Main game loop
setInterval(() => {
  update();
  draw();
}, 16); // 16ms = 60fps
