const modal = document.getElementById('addPlayersModal'),
    addPlayerButton = modal.querySelector('#addPlayerBtn'),
    startGameButton = modal.querySelector('#startGameBtn'),
    playerList = document.getElementById('playerList');

let players = [];
const colors = ["red", "green", "purple", "blue", "orange", "yellow"];

modal.style.display = 'block';

// Add Player button click handler
addPlayerButton.addEventListener('click', function() {
    if (players.length < 6) {
        const playerId = players.length + 1,
            playerName = `Player ${playerId}`,
            playerElement = document.createElement('div');

        playerElement.innerHTML = `<strong><span style="color: ${colors[players.length]}">${playerName}</span></strong>:` + 
        ` Left Key: <span id="leftKey${playerId}"></span>, Right Key: <span id="rightKey${playerId}"></span>`;
        playerList.appendChild(playerElement);

        let leftKey = undefined,
            rightKey = undefined;

        document.addEventListener('keydown', function(event) {
            leftKey = event.key
            document.getElementById(`leftKey${playerId}`).textContent = leftKey;
            
            document.addEventListener('keydown', function(event) {
                rightKey = event.key;
                document.getElementById(`rightKey${playerId}`).textContent = rightKey;

                const player = new Player(ctx, playerRadius, players.length, colors[players.length]);
                player.setKeys(leftKey, rightKey);
                players.push(player);

              }, { once: true });

        }, { once: true });
    } else {
        alert('Maximum 6 players allowed!');
    }
});

startGameButton.addEventListener('click', function() {
    if (players.length < 1) {
        alert('Minimum 1 player!');
    } else {
        modal.style.display = 'none';
        setup();
    }    
});

const canvas = document.getElementById("canvas"),
    ctx = canvas.getContext('2d');
    CANVAS_WIDTH = canvas.width,
    CANVAS_HEIGHT = canvas.height,
    playerRadius = 4.5,
    immuneLength = 100;

let gameIndex = 0,
    game = undefined;

// Controls
let leftPressed = false;
let rightPressed = false;

let isResetting = false;

function draw() {
    
  
    if (!isResetting) {
        ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        game.draw();
        gameIndex++;
    }
  
    if (game.roundOver() && !isResetting) {
        isResetting = true; // Set the flag to true to indicate reset process
        setTimeout(() => {
            game.resetPlayers();
            isResetting = false; // Reset the flag after resetting players
      }, 1000); // 5000 milliseconds = 5 seconds
    }
  
    requestAnimationFrame(draw);
  }

function setup() {    
    game = new Game(players);

    draw();
}