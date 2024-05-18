// Speed boost self/others
// Slow self/others
// Pass through wall self/all
// Clear board
// Reverse other controls
// Mystery
// Square turns self/others
// Spawn more powerups
// Free float over lines


class PowerUp {
    constructor(x, y, id) {
        this.x = x;
        this.y = y;
        this.id = id;
        this.radius = 45;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = "white"
        ctx.fill();
        ctx.closePath();
    }
}

class SelfSpeedUp extends PowerUp {
    constructor(x, y, id) {
        super(x, y, id);
    }

    apply(player) {
        player.speed *= 2;
        player.turningSpeed *= 1.2;
        setTimeout(() => {
            player.speed /= 2;
            player.turningSpeed /= 1.2;
      }, 3000);
    }
}