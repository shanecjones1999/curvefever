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
    immuneLength = 100,
    minTrailGap = 30;

let gameIndex = 0,
    game = undefined;

let isResetting = false;

function draw() {
    if (!isResetting) {
        ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        game.draw();
        gameIndex++;
    }
  
    if (game.roundOver() && !isResetting) {
        isResetting = true;
        setTimeout(() => {
            game.reset();
            gameIndex = 0;
            game.round += 1
            isResetting = false;
      }, 3000);
    }
  
    requestAnimationFrame(draw);
  }

function setup() {    
    game = new Game(players);
    displayScores()
    draw();
}

function displayScores() {
    const scoreboard = document.getElementById('score-list');

    if (!game) {
        return;
    }

    scoreboard.innerHTML = '';

    game.players.forEach(player => {
        const playerDiv = document.createElement('div');
        playerDiv.textContent = `Player ${player.id + 1}: ${player.score}`;
        playerDiv.style.color = player.color;
        playerDiv.classList.add('player-score');
        playerDiv.id = `player-${player.id}-score`;
        scoreboard.appendChild(playerDiv);
    });
}