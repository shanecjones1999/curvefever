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

const PowerUpType = {
    SpeedUp: 0,
    SlowDown: 1,
    Reverse: 2,
    SharpTurns: 3,
    ThickLine: 4,
    ThinLine: 5,
    Float: 6,
    WallPass: 7,
}

class PowerUp {
    constructor(x, y, id, type, players, color, text, others) {
        this.x = x;
        this.y = y;
        this.id = id;
        this.type = type;
        this.players = players;
        this.color = color;
        this.text = text;
        this.applyToOthers = others;
        this.radius = 40;
        this.duration = 3000;
    }

    draw() {
        const borderColor = "yellow";
        const fontSize = 20;

        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();

        ctx.lineWidth = 2;
        ctx.strokeStyle = borderColor;
        ctx.stroke();
        ctx.closePath();

        ctx.fillStyle = "white";
        ctx.font = `${fontSize}px Arial`;

        const textWidth = ctx.measureText(this.text).width;
        ctx.fillText(this.text, this.x - textWidth / 2, this.y + fontSize / 2);
    }

    apply(sourceId) {
        if (this.applyToOthers) {
            for (let i = 0; i < this.players.length; i++) {
                if (this.players[i].id != sourceId) {
                    this.players[i].addPowerUp(this.type);
                }
            }
        } else {
            const player = this.players.filter(plyr => plyr.id == sourceId)[0];
            player.addPowerUp(this.type)
        }
    }    
}

class SpeedUp extends PowerUp {
    constructor(x, y, id, players, color, text, others) {
        super(x, y, id, PowerUpType.SpeedUp, players, color, text, others);
    }
}

class SlowDown extends PowerUp {
    constructor(x, y, id, players, color, text, others) {
        super(x, y, id, PowerUpType.SlowDown, players, color, text, others);
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
    constructor(x, y, id, players, color, text, others) {
        super(x, y, id, PowerUpType.Reverse, players, color, text, others);
    }
}

class SharpTurns extends PowerUp {
    constructor(x, y, id, players, color, text, others) {
        super(x, y, id, PowerUpType.SharpTurns, players, color, text, others);
    }
}

class ThickLine extends PowerUp {
    constructor(x, y, id, players, color, text, others) {
        super(x, y, id, PowerUpType.ThickLine, players, color, text, others);
    }
}

class ThinLine extends PowerUp {
    constructor(x, y, id, players, color, text, others) {
        super(x, y, id, PowerUpType.ThinLine, players, color, text, others);
    }
}

class Float extends PowerUp {
    constructor(x, y, id, players, color, text, others) {
        super(x, y, id, PowerUpType.Float, players, color, text, others);
    }
}

class WallPass extends PowerUp {
    constructor(x, y, id, players, color, text, others) {
        super(x, y, id, PowerUpType.WallPass, players, color, text, others);
    }
}
