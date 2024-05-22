// Spawn more powerups
// Mystery

const powerUpDuration = 250;

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
};

const ApplyType = {
    Self: 0,
    Others: 1,
    All: 2,
}

class PowerUp {
    constructor(x, y, id, type, players, text, applyType) {
        this.x = x;
        this.y = y;
        this.id = id;
        this.type = type;
        this.players = players;
        this.text = text;
        this.applyType = applyType;
        this.radius = 40;
        this.duration = powerUpDuration;
        this.color = applyType == ApplyType.Self ? 'rgba(0, 255, 0, 0.7)' 
            : applyType == ApplyType.Others ? 'rgba(255, 0, 0, 0.7)' 
            : 'rgba(0, 0, 255, 0.7)'
    }

    draw() {
        const borderColor = "yellow";
        const fontSize = 20;

        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.applyType == ApplyType.Self ? "green" : this.applyType == ApplyType.Others ? "red" : "blue";
        ctx.fill();

        ctx.lineWidth = 3;
        ctx.strokeStyle = borderColor;
        ctx.stroke();
        ctx.closePath();

        ctx.fillStyle = "white";
        ctx.font = `${fontSize}px Arial`;

        const textWidth = ctx.measureText(this.text).width;
        ctx.fillText(this.text, this.x - textWidth / 2, this.y + fontSize / 2);
    }

    apply(sourceId) {
        switch (this.applyType) {
            case ApplyType.Self:
                const player = this.players.filter(plyr => plyr.id == sourceId)[0];
                player.addPowerUp(this);
                break;
            case ApplyType.All:
                for (let i = 0; i < this.players.length; i++) {
                    this.players[i].addPowerUp(this);
                }
                break;
            case ApplyType.Others:
                for (let i = 0; i < this.players.length; i++) {
                    if (this.players[i].id != sourceId) {
                        this.players[i].addPowerUp(this);
                    }
                }
                break;
            default:
                console.error('Invalid applyType');
                break;
        }
    }   
}

class SpeedUp extends PowerUp {
    constructor(x, y, id, players, text, applyType) {
        super(x, y, id, PowerUpType.SpeedUp, players, text, applyType);
    }
}

class SlowDown extends PowerUp {
    constructor(x, y, id, players, text, applyType) {
        super(x, y, id, PowerUpType.SlowDown, players, text, applyType);
    }
}

class BoardClear extends PowerUp {
    constructor(x, y, id, players, text, applyType) {
        super(x, y, id, PowerUpType.Clear, players, text, applyType);
    }

    apply(_) {
        for (let i = 0; i < this.players.length; i++) {
            this.players[i].resetTrail();
        }
    }
}

class Reverse extends PowerUp {
    constructor(x, y, id, players, text, applyType) {
        super(x, y, id, PowerUpType.Reverse, players, text, applyType);
    }
}

class SharpTurns extends PowerUp {
    constructor(x, y, id, players, text, applyType) {
        super(x, y, id, PowerUpType.SharpTurns, players, text, applyType);
    }
}

class ThickLine extends PowerUp {
    constructor(x, y, id, players, text, applyType) {
        super(x, y, id, PowerUpType.ThickLine, players, text, applyType);
    }
}

class ThinLine extends PowerUp {
    constructor(x, y, id, players, text, applyType) {
        super(x, y, id, PowerUpType.ThinLine, players, text, applyType);
    }
}

class Float extends PowerUp {
    constructor(x, y, id, players, text, applyType) {
        super(x, y, id, PowerUpType.Float, players, text, applyType);
    }
}

class Wrap extends PowerUp {
    constructor(x, y, id, players, text, applyType) {
        super(x, y, id, PowerUpType.Wrap, players, text, applyType);
    }

    apply(sourceId) {
        if (!this.applyType != ApplyType.All) {
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
                powerUp = new SpeedUp(x, y, gameIndex, players, "Speed", ApplyType.Self);
                break;
            case 1:
                powerUp = new SpeedUp(x, y, gameIndex, players, "Speed", ApplyType.Others);
                break;
            case 2:
                powerUp = new SlowDown(x, y, gameIndex, players, "Slow", ApplyType.Self);
                break;
            case 3:
                powerUp = new SlowDown(x, y, gameIndex, players, "Slow", ApplyType.Others);
                break;
            case 4:
                powerUp = new Reverse(x, y, gameIndex, players, "Reverse", ApplyType.Others);
                break;
            case 5:
                powerUp = new SharpTurns(x, y, gameIndex, players, "Square", ApplyType.Self);
                break;
            case 6:
                powerUp = new SharpTurns(x, y, gameIndex, players, "Square", ApplyType.Others);
                break;
            case 7:
                powerUp = new ThickLine(x, y, gameIndex, players, "Thick", ApplyType.Self);
                break;
            case 8:
                powerUp = new ThickLine(x, y, gameIndex, players, "Thick", ApplyType.Others);
                break;
            case 9:
                powerUp = new ThinLine(x, y, gameIndex, players, "Thin", ApplyType.Self);
                break;
            case 10:
                powerUp = new ThinLine(x, y, gameIndex, players, "Thin", ApplyType.Others);
                break;
            case 11:
                powerUp = new Float(x, y, gameIndex, players, "Float", ApplyType.Self);
                break;
            case 12:
                powerUp = new Wrap(x, y, gameIndex, players, "Wrap", ApplyType.Self);
                break;
            case 13:
                powerUp = new Wrap(x, y, gameIndex, players, "Wrap", ApplyType.All);
                break;
            case 14:
                powerUp = new BoardClear(x, y, gameIndex, players, "Clear", ApplyType.All);
                break;
            default:
                console.error("Invalid power-up to generate");
        }

        return powerUp;
    }
}
