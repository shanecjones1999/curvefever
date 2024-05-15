document.addEventListener("DOMContentLoaded", setup);

const canvas = document.getElementById("canvas"),
    ctx = canvas.getContext('2d');
    CANVAS_WIDTH = canvas.width,
    CANVAS_HEIGHT = canvas.height,
    playerRadius = 4.5;

// Player
let playerX = canvas.width / 2;
let playerY = canvas.height / 2;

let gameIndex = 0;

const players = [],
    immuneLength = 100;

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

    if (detectCollisions()) {
        return;
    }

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
        if (players[i].isOutOfBounds()) {
            return true;
        }
        for (let j = 0; j < players.length; j++) {
            const segments = players[j].trail.segments;
            for (let k = 0; k < segments.length; k++) {
                const points = segments[k].points;
                for (let l = 0; l < points.length; l ++) {
                    if (players[i].hasTrail && isValidTrailPoint(points[l], i == j) 
                    && areCirclesOverlapping(players[i].x, players[i].y, points[l].x, points[l].y)) {
                    return true;
                }
                }
            }
        }
    }

    return false;
}

function isValidTrailPoint(segment, self) {
    if (!self) {
        return true;
    }

    // We do not want to look for a collision if this is our trail within ~ playerRadius * 2 pixels
    return gameIndex - segment.idx > playerRadius * 2;
}

function areCirclesOverlapping(x1, y1, x2, y2) {
    const dx = x2 - x1;
    const dy = y2 - y1;
    const distance = Math.sqrt(dx * dx + dy * dy);

    // TODO
    // Investigate this, currently a hacked constant but may not be ideal
    return distance <= this.playerRadius * 2 - 3;
}

function setup() {
    const player = new Player(ctx, playerRadius, 1, "blue");
    players.push(player);
    draw();
}