class Game {
    constructor(players, powerUpsEnabled) {
        this.round = 1;
        this.totalRounds = 10;
        this.players = players
        this.score = new Score();
        this.powerUpsEnabled = powerUpsEnabled;
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
                        if (this.players[i].hasTrail && this.isValidTrailPoint(points[l], this.players[i].getSize(), i == j) 
                        && this.areCirclesOverlapping(this.players[i].x, this.players[i].y, points[l].x, points[l].y, this.players[i].getSize() + points[l].size)) {
                            this.eliminatePlayer(this.players[i]);
                    }
                    }
                }
            }
        }
    
        return false;
    }
    
    isValidTrailPoint(point, playerSize, self) {
        if (!self) {
            return true;
        }
    
        // TODO: Adjust. We do not want to look for a collision if this is our trail within ~ playerSize() 2 pixels
        return gameIndex - point.idx > playerSize * 2;
    }
    
    areCirclesOverlapping(x1, y1, x2, y2, radius) {
        const dx = x2 - x1,
            dy = y2 - y1,
            distance = Math.sqrt(dx * dx + dy * dy);
        return distance <= radius;
    }

    generatePowerUps() {
        const shouldGenerate = Math.floor(Math.random() * 200) == 1;
        if (shouldGenerate) {

            const type =  Math.floor(Math.random() * 15),
                powerUp = PowerUpFactory.Create(7, this.players);

            if (powerUp) {
                this.powerUps.push(powerUp);
            }
        }
    }

    displayPowerUps() {
        for (let i = 0; i < this.powerUps.length; i++) {
            this.powerUps[i].draw();
        }
    }

    detectPowerUpCollisons() {
        for (let i = 0; i < this.players.length; i++) {
            for (let j = 0; j < this.powerUps.length; j++) {
                if (!this.players[i].eliminated && 
                    this.areCirclesOverlapping(this.players[i].x, this.players[i].y, this.powerUps[j].x, this.powerUps[j].y, this.players[i].getSize() + this.powerUps[j].radius)) {
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