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
    Wrap: 7,
    Clear: 8,
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
    constructor(x, y, id, players, color, text, others) {
        super(x, y, id, PowerUpType.Clear, players, color, text, others);
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

class Wrap extends PowerUp {
    constructor(x, y, id, players, color, text, others) {
        super(x, y, id, PowerUpType.Wrap, players, color, text, others);
    }

    apply(sourceId) {
        if (!this.applyToOthers) {
            super.apply(sourceId);
            return;
        }

        for (let i = 0; i < this.players.length; i++) {
            this.players[i].addPowerUp(this.type);
        }
    }
}

class PowerUpFactory {
    static Create(type, players) {
        let powerUp = undefined;

        const x = Math.floor(Math.random() * CANVAS_WIDTH),
            y = Math.floor(Math.random() * CANVAS_HEIGHT);

        switch (type) {
            case 0:
                powerUp = new SpeedUp(x, y, gameIndex, players, "green", "Speed", false);
                break;
            case 1:
                powerUp = new SpeedUp(x, y, gameIndex, players, "red", "Speed", true);
                break;
            case 2:
                powerUp = new SlowDown(x, y, gameIndex, players, "green", "Slow", false);
                break;
            case 3:
                powerUp = new SlowDown(x, y, gameIndex, players, "red", "Slow", true);
                break;
            case 4:
                powerUp = new Reverse(x, y, gameIndex, players, "red", "Reverse", true);
                break;
            case 5:
                powerUp = new SharpTurns(x, y, gameIndex, players, "green", "Square", false);
                break;
            case 6:
                powerUp = new SharpTurns(x, y, gameIndex, players, "red", "Square", true);
                break;
            case 7:
                powerUp = new ThickLine(x, y, gameIndex, players, "green", "Thick", false);
                break;
            case 8:
                powerUp = new ThickLine(x, y, gameIndex, players, "red", "Thick", true);
                break;
            case 9:
                powerUp = new ThinLine(x, y, gameIndex, players, "green", "Thin", false);
                break;
            case 10:
                powerUp = new ThinLine(x, y, gameIndex, players, "red", "Thin", true);
                break;
            case 11:
                powerUp = new Float(x, y, gameIndex, players, "green", "Float");
                break;
            case 12:
                powerUp = new Wrap(x, y, gameIndex, players, "green", "Wrap", false);
                break;
            case 13:
                powerUp = new Wrap(x, y, gameIndex, players, "blue", "Wrap", true);
                break;
            case 14:
                powerUp = new BoardClear(x, y, gameIndex, players, "blue", "Clear", false);
                break;
            default:
                console.error("Invalid power-up to generate");
        }

        return powerUp;
    }
}
