// Slow self/others
// Pass through wall self/all
// Clear board
// Reverse other controls
// Mystery
// Square turns self/others
// Spawn more powerups
// Free float over lines


class PowerUp {
    constructor(x, y, id, players, color, text) {
        this.x = x;
        this.y = y;
        this.id = id;
        this.players = players;
        this.color = color;
        this.text = text;
        this.radius = 40;
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
        }, 3000);
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
        }, 3000);
    }
}