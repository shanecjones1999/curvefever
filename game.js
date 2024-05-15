document.addEventListener("DOMContentLoaded", setup);

const canvas = document.getElementById("canvas"),
    ctx = canvas.getContext('2d');
    CANVAS_WIDTH = canvas.width,
    CANVAS_HEIGHT = canvas.height,
    playerRadius = 5;

// Player
let playerX = canvas.width / 2;
let playerY = canvas.height / 2;

let gameIndex = 0;

const players = [];

// Controls
let leftPressed = false;
let rightPressed = false;

// Event listeners for key presses
document.addEventListener("keydown", keyDownHandler);
document.addEventListener("keyup", keyUpHandler);

function keyDownHandler(event) {
    if (event.key === "ArrowLeft") {
        leftPressed = true;
    } else if (event.key === "ArrowRight") {
        rightPressed = true;
    }
}

function keyUpHandler(event) {
    if (event.key === "ArrowLeft") {
        leftPressed = false;
    } else if (event.key === "ArrowRight") {
        rightPressed = false;
    }
}

function draw() {
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    drawPlayers();
    gameIndex++;

    // if (detectCollisions()) {
    //     return;
    // }

    requestAnimationFrame(draw);
}

function drawPlayers() {
    for (let i = 0; i < players.length; i++) {
        players[i].draw();
        players[i].move(leftPressed, rightPressed);
    }
}

function detectCollisions() {
    for (let i = 0; i < players.length; i++) {
        for (let j = 0; j < players.length; j++) {
            const trail = players[j].trail;
            for (let k = 0; k < trail.length; k++) {
                if (players[i].hasTrail && isValidTrail(trail[k], i == j) 
                    && areCirclesOverlapping(players[i].x, players[i].y, trail[k].x, trail[k].y)) {
                    return true;
                }
            }
        }
    }

    return false;
}

function isValidTrail(trail, self) {
    if (!self) {
        return true;
    }

    return gameIndex - trail.idx > playerRadius + 1;
}

function areCirclesOverlapping(x1, y1, x2, y2) {
    // Calculate the distance between the centers of the circles
    const dx = x2 - x1;
    const dy = y2 - y1;
    const distance = Math.sqrt(dx * dx + dy * dy);

    // Check if the distance is less than or equal to the sum of the radii
    return distance <= this.playerRadius * 2;
}

function setup() {
    const player = new Player(playerX, playerY, ctx, playerRadius, 1, "blue");
    players.push(player);
    draw();
}