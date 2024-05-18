class Game {
    constructor(players) {
        this.round = 1;
        this.totalRounds = 10;
        this.players = players
        this.score = new Score();
    }
    
    draw() {
        for (let i = 0; i < this.players.length; i++) {
            this.players[i].draw();

            if (!players[i].eliminated) {
                this.players[i].move();
            }
        }

        this.detectCollisions();
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
        playerScore.textContent = `Player ${id}: ${score}`;
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
                        && this.areCirclesOverlapping(this.players[i].x, this.players[i].y, points[l].x, points[l].y)) {
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
    
    areCirclesOverlapping(x1, y1, x2, y2) {
        const dx = x2 - x1;
        const dy = y2 - y1;
        const distance = Math.sqrt(dx * dx + dy * dy);
    
        // TODO
        // Investigate this, currently a hacked constant but may not be ideal
        return distance <= playerRadius * 2 - 3;
    }
}