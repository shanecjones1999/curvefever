document.addEventListener("DOMContentLoaded", setup);

const canvas = document.getElementById("canvas"),
    ctx = canvas.getContext('2d');
    CANVAS_WIDTH = canvas.width,
    CANVAS_HEIGHT = canvas.height,
    playerRadius = 4.5,
    immuneLength = 100;

let gameIndex = 0,
    game = undefined;

let playerControls = new Controls();
playerControls.setKeyBindings();

// Controls
let leftPressed = false;
let rightPressed = false;

// Event listeners for key presses
document.addEventListener("keydown", keyDownHandler);
document.addEventListener("keyup", keyUpHandler);

function keyDownHandler(event) {
    if (event.key === playerControls.leftKey) {
        leftPressed = true;
    } else if (event.key === playerControls.rightKey) {
        rightPressed = true;
    }
}

function keyUpHandler(event) {
    if (event.key === playerControls.leftKey) {
        leftPressed = false;
    } else if (event.key === playerControls.rightKey) {
        rightPressed = false;
    }
}

function draw() {
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    game.draw();
    gameIndex++;

    if (game.detectCollisions()) {
        return;
    }

    requestAnimationFrame(draw);
}

function setup() {
    const player = new Player(ctx, playerRadius, 1, "blue"), 
        players = [player];
    
    game = new Game(players);

    draw();
}