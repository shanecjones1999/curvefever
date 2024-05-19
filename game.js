class Game {
    constructor(players) {
        this.round = 1;
        this.totalRounds = 10;
        this.players = players
        this.score = new Score();
        this.powerUpsEnabled = true;
        this.powerUps = [];
    }
    
    draw() {
        if (this.powerUpsEnabled) {
            this.generatePowerUps();
            this.displayPowerUps();
            this.detectPowerUpCollisons()
        }

        for (let i = 0; i < this.players.length; i++) {
            this.players[i].draw();

            if (!players[i].eliminated) {
                this.players[i].move();
            }
        }

        this.detectCollisions();
    }

    reset() {
        this.resetPlayers();
        this.powerUps = [];
    }

    resetPlayers() {
        for (let i = 0; i < this.players.length; i++) {
            this.players[i].reset();
        }
    }

    roundOver() {
        const playerCount = this.players.length;
        if (playerCount == 1) {
            return this.players[0].eliminated;
        }

        let eliminatedCount = 0;

        for (let i = 0; i < this.players.length; i++) {
            if (this.players[i].eliminated) {
                eliminatedCount += 1;
            }
        }

        return eliminatedCount >= playerCount - 1;
    }

    eliminatePlayer(player) {
        if (player.eliminated) {
            return;
        }

        player.eliminated = true;
        for (let i = 0; i < this.players.length; i++) {
            if (!this.players[i].eliminated && this.players[i].id != player.id) {
                this.players[i].score += 1;
                this.updateScoreBoard(this.players[i].id, this.players[i].score);
                
            }
        }
    }

    updateScoreBoard(id, score) {
        const playerScore = document.getElementById(`player-${id}-score`);
        playerScore.textContent = `Player ${id + 1}: ${score}`;
    }
    
    detectCollisions() {
        for (let i = 0; i < this.players.length; i++) {
            if (this.players[i].isOutOfBounds()) {
                this.eliminatePlayer(this.players[i]);
            }
            for (let j = 0; j < this.players.length; j++) {
                const segments = this.players[j].trail.segments;
                for (let k = 0; k < segments.length; k++) {
                    const points = segments[k].points;
                    for (let l = 0; l < points.length; l ++) {
                        if (this.players[i].hasTrail && this.isValidTrailPoint(points[l], i == j) 
                        && this.areCirclesOverlapping(this.players[i].x, this.players[i].y, points[l].x, points[l].y, this.players[i].size + points[l].size - 3)) {
                            this.eliminatePlayer(this.players[i]);
                    }
                    }
                }
            }
        }
    
        return false;
    }
    
    isValidTrailPoint(segment, self) {
        if (!self) {
            return true;
        }
    
        // We do not want to look for a collision if this is our trail within ~ playerRadius * 2 pixels
        return gameIndex - segment.idx > playerRadius * 2;
    }
    
    areCirclesOverlapping(x1, y1, x2, y2, radius) {
        const dx = x2 - x1,
            dy = y2 - y1,
            distance = Math.sqrt(dx * dx + dy * dy);
    
        // TODO
        // Investigate this, currently a hacked constant but may not be ideal
        return distance <= radius;
    }

    generatePowerUps() {
        const shouldGenerate = Math.floor(Math.random() * 250) == 1;
        if (shouldGenerate) {
            const powerUpToGenerate = Math.floor(Math.random() * 14),
                x = Math.floor(Math.random() * CANVAS_WIDTH),
                y = Math.floor(Math.random() * CANVAS_HEIGHT);

            let powerUp = undefined;

            switch (7) {
                case 0:
                    powerUp = new SpeedUp(x, y, gameIndex, this.players, "green", "Speed", false);
                    this.powerUps.push(powerUp);
                    break;
                case 1:
                    powerUp = new SpeedUp(x, y, gameIndex, this.players, "red", "Speed", true);
                    this.powerUps.push(powerUp);
                    break;
                case 2:
                    powerUp = new SlowDown(x, y, gameIndex, this.players, "green", "Slow", false);
                    this.powerUps.push(powerUp);
                    break;
                case 3:
                    powerUp = new SlowDown(x, y, gameIndex, this.players, "red", "Slow", true);
                    this.powerUps.push(powerUp);
                    break;
                case 4:
                    powerUp = new Reverse(x, y, gameIndex, this.players, "red", "Reverse", true);
                    this.powerUps.push(powerUp);
                    break;
                case 5:
                    powerUp = new SharpTurns(x, y, gameIndex, this.players, "green", "Square", false);
                    this.powerUps.push(powerUp);
                    break;
                case 6:
                    powerUp = new SharpTurns(x, y, gameIndex, this.players, "red", "Square", true);
                    this.powerUps.push(powerUp);
                    break;
                case 7:
                    powerUp = new ThickLine(x, y, gameIndex, this.players, "green", "Thick", false);
                    this.powerUps.push(powerUp);
                    break;
                case 8:
                    powerUp = new ThickLine(x, y, gameIndex, this.players, "red", "Thick", true);
                    this.powerUps.push(powerUp);
                    break;
                case 9:
                    powerUp = new ThinLine(x, y, gameIndex, this.players, "green", "Thin", false);
                    this.powerUps.push(powerUp);
                    break;
                case 10:
                    powerUp = new ThinLine(x, y, gameIndex, this.players, "red", "Thin", true);
                    this.powerUps.push(powerUp);
                    break;
                case 11:
                    powerUp = new Float(x, y, gameIndex, this.players, "green", "Float");
                    this.powerUps.push(powerUp);
                    break;
                case 12:
                    powerUp = new WallPass(x, y, gameIndex, this.players, "green", "WallPass", false);
                    this.powerUps.push(powerUp);
                    break;
                case 13:
                    powerUp = new WallPass(x, y, gameIndex, this.players, "blue", "Wall Pass", true);
                    this.powerUps.push(powerUp);
                    break;
                // TODO: Address board clear later
                case 4:
                    powerUp = new BoardClear(x, y, gameIndex, this.players, "blue", "Clear");
                    this.powerUps.push(powerUp);
                    break;
                default:
                    console.error("Invalid power-up to generate");
            }

            //const powerUp = new SelfSpeedUp(x, y, gameIndex, "green", "Speedy");
            //this.powerUps.push(powerUp);
        }
    }

    displayPowerUps() {
        for (let i = 0; i < this.powerUps.length; i++) {
            this.powerUps[i].draw();
        }
    }

    detectPowerUpCollisons() {
        for (let i = 0; i < this.players.length; i++) {
            // check if player is alive
            for (let j = 0; j < this.powerUps.length; j++) {
                if (!this.players[i].eliminated && 
                    this.areCirclesOverlapping(this.players[i].x, this.players[i].y, this.powerUps[j].x, this.powerUps[j].y, playerRadius + this.powerUps[j].radius)) {
                        this.powerUps[j].apply(this.players[i].id);

                        this.removePowerUp(this.powerUps[j].id);
                    }
            }
        }
    }

    removePowerUp(id) {
        this.powerUps = this.powerUps.filter(powerUp => powerUp.id != id);
    }
}