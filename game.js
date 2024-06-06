const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = 800;
canvas.height = 800;

let score = 0;
let gameSpeed = 0.5; // Faster initial speed
let obstacles = [];
let frame = 0;
let gameRequest;

const player = {
    x: 50,
    y: 100,
    size: 30,
    speedY: 0,
    gravity: 0.1, // Dynamic gravity effect
    update: function() {
        this.speedY += this.gravity;
        this.y += this.speedY;
        this.y = Math.max(this.y, 0);
        this.y = Math.min(this.y, canvas.height - this.size);
        ctx.fillStyle = 'red';

        // Do a human player: 
        
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.x + this.size, this.y);
        ctx.lineTo(this.x, this.y + this.size);
        ctx.closePath();
        ctx.fill();
    }
};

function createObstacle() {
    let minHeight = 20;
    let maxHeight = 200;
    let height = Math.floor(Math.random() * (maxHeight - minHeight + 1) + minHeight);
    let gap = 150;
    let obstacleX = canvas.width;
    
    obstacles.push({
        x: obstacleX,
        y: 0,
        width: 30,
        height: height
    });
    obstacles.push({
        x: obstacleX,
        y: height + gap,
        width: 30,
        height: canvas.height - height - gap
    });
}

function updateGameArea() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    frame++;
    if (frame % 100 === 0) {  // Frequent obstacles
        createObstacle();
        score++;
        gameSpeed += 1; // Speed increase
    }

    obstacles.forEach((obstacle, index) => {
        obstacle.x -= gameSpeed;
        ctx.fillStyle = 'green';
        ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
        
        if (obstacle.x + obstacle.width < 0) {
            obstacles.splice(index, 1);
        }

        if (player.x < obstacle.x + obstacle.width &&
            player.x + player.size > obstacle.x &&
            player.y < obstacle.y + obstacle.height &&
            player.y + player.size > obstacle.y) {
            stopGame();
        }
    });

    player.update();
    ctx.fillStyle = 'white';
    ctx.font = '16px Arial';
    ctx.fillText(`Score: ${score}`, 10, 20);
    gameRequest = window.requestAnimationFrame(updateGameArea);
}

function startGame() {
    obstacles = [];
    score = 0;
    frame = 0;
    gameSpeed = 2; // Reset game speed
    player.y = 150;
    if (gameRequest) {
        window.cancelAnimationFrame(gameRequest);
    }
    gameRequest = window.requestAnimationFrame(updateGameArea);
}

function stopGame() {
    window.cancelAnimationFrame(gameRequest);
    alert("Game Over! Your score was: " + score);
    startGame();
}

document.addEventListener('keydown', function(e) {
    if (e.code == 'Space' || e.code == 'ArrowUp') {
        player.speedY = -3;
    } else if (e.code == 'ArrowDown') {
        player.speedY = 3;
    }
});

document.addEventListener('keyup', function(e) {
    if (e.code == 'Space' || e.code == 'ArrowUp' || e.code == 'ArrowDown') {
        player.speedY = 0;
    }
});

startGame();
