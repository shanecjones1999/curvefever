// Speed
// Slow self/others
// Clear board
// Reverse other controls
// Square turns self/others



// Free float over lines
// Pass through wall self/all
// Line width self/others

// Spawn more powerups
// Mystery

class PowerUp {
    constructor(x, y, id, players, color, text) {
        this.x = x;
        this.y = y;
        this.id = id;
        this.players = players;
        this.color = color;
        this.text = text;
        this.radius = 40;
        this.duration = 3000;
    }

    draw() {
        const borderColor = "yellow";
        const fontSize = 20;

        // Draw the circle with the specified fill color
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();

        // Add a yellow border
        ctx.lineWidth = 2;
        ctx.strokeStyle = borderColor;
        ctx.stroke();
        ctx.closePath();

        // Add the text
        ctx.fillStyle = "white"; // Set text color
        ctx.font = `${fontSize}px Arial`;

        const textWidth = ctx.measureText(this.text).width;
        ctx.fillText(this.text, this.x - textWidth / 2, this.y + fontSize / 2);
    }
}

class SpeedUp extends PowerUp {
    constructor(x, y, id, players, color, text, others) {
        super(x, y, id, players, color, text);
        this.others = others;
    }

    apply(sourceId) {
        if (this.others) {
            for (let i = 0; i < players.length; i++) {
                if (players[i].id != sourceId) {
                    this.speedPlayerUp(players[i]);
                }
            }
        } else {
            const player = this.players.filter(plyr => plyr.id == sourceId)[0];
            this.speedPlayerUp(player);
        }
    }

    speedPlayerUp(player) {
        player.speed *= 2;
        player.turningSpeed *= 1.3;
        setTimeout(() => {
            player.speed /= 2;
            player.turningSpeed /= 1.3;
        }, this.duration);
    }
}

class SlowDown extends PowerUp {
    constructor(x, y, id, players, color, text, others) {
        super(x, y, id, players, color, text);
        this.others = others;
    }

    apply(sourceId) {
        if (this.others) {
            for (let i = 0; i < players.length; i++) {
                if (players[i].id != sourceId) {
                    this.slowPlayerDown(players[i]);
                }
            }
        } else {
            const player = this.players.filter(plyr => plyr.id == sourceId)[0];
            this.slowPlayerDown(player);
        }
    }

    slowPlayerDown(player) {
        player.speed /= 2;
        setTimeout(() => {
            player.speed *= 2;
        }, this.duration);
    }
}

class BoardClear extends PowerUp {
    constructor(x, y, id, players, color, text) {
        super(x, y, id, players, color, text);
    }

    apply(_) {
        for (let i = 0; i < this.players.length; i++) {
            this.players[i].resetTrail();
        }
    }
}

class Reverse extends PowerUp {
    constructor(x, y, id, players, color, text) {
        super(x, y, id, players, color, text);
    }

    apply(sourceId) {
        for (let i = 0; i < this.players.length; i++) {
            if (this.players[i].id != sourceId) {
                this.reverseControls(this.players[i]);
            }
        }
    }

    reverseControls(player) {
        player.reverseControls();
        setTimeout(() => {
            player.reverseControls();
        }, this.duration);
    }
}

class SharpTurns extends PowerUp {
    constructor(x, y, id, players, color, text, others) {
        super(x, y, id, players, color, text);
        this.others = others;
    }

    apply(sourceId) {
        if (this.others) {
            for (let i = 0; i < players.length; i++) {
                if (this.players[i].id != sourceId) {
                    this.giveSharpTurns(this.players[i]);
                }
            }
        } else {
            const player = this.players.filter(plyr => plyr.id == sourceId)[0];
            this.giveSharpTurns(player);
        }
    }

    giveSharpTurns(player) {
        player.toggleSharpTurns();
        setTimeout(() => {
            player.toggleSharpTurns();
        }, this.duration);
    }
}

class ThickLine extends PowerUp {
    constructor(x, y, id, players, color, text, others) {
        super(x, y, id, players, color, text);
        this.others = others;
    }

    apply(sourceId) {
        if (this.others) {
            for (let i = 0; i < players.length; i++) {
                if (this.players[i].id != sourceId) {
                    this.giveThickLine(this.players[i]);
                }
            }
        } else {
            const player = this.players.filter(plyr => plyr.id == sourceId)[0];
            this.giveThickLine(player);
        }
    }

    giveThickLine(player) {
        player.toggleThickLine();
        setTimeout(() => {
            player.toggleThinLine();
        }, this.duration);
    }
}

class ThinLine extends PowerUp {
    constructor(x, y, id, players, color, text, others) {
        super(x, y, id, players, color, text);
        this.others = others;
    }

    apply(sourceId) {
        if (this.others) {
            for (let i = 0; i < players.length; i++) {
                if (this.players[i].id != sourceId) {
                    this.giveThinLine(this.players[i]);
                }
            }
        } else {
            const player = this.players.filter(plyr => plyr.id == sourceId)[0];
            this.giveThinLine(player);
        }
    }

    giveThinLine(player) {
        player.toggleThinLine();
        setTimeout(() => {
            player.toggleThickLine();
        }, this.duration);
    }
}

class Float extends PowerUp {
    constructor(x, y, id, players, color, text) {
        super(x, y, id, players, color, text);
    }

    apply(sourceId) {
        for (let i = 0; i < this.players.length; i++) {
            if (this.players[i].id == sourceId) {
                this.toggleFloat(this.players[i]);
            }
        }
    }

    toggleFloat(player) {
            player.hasFloatPowerUp = true;
            player.trail.createSegment();
            player.hasTrail = false;
            setTimeout(() => {
                player.hasFloatPowerUp = false;
                player.hasTrail = true;
            }, this.duration);
        }
}
