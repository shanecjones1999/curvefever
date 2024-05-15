class Player {
    constructor(x, y, ctx, radius, id, color) {
        this.x = x;
        this.y = y;
        this.ctx = ctx;
        this.color = color;
        this.playerAngle = Math.PI / 2;
        this.trail = new Trail();
        this.trail.createSegment();
        this.size = radius;
        this.turningSpeed = 0.045;
        this.playerSpeed = 2;
        this.id = id
        this.lastTrailSkip = 0;
        this.hasTrail = true;
    }

    draw() {
        this.trail.draw(this.ctx, this.size, this.color);
        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        this.ctx.fillStyle = this.color;
        this.ctx.fill();
        this.ctx.closePath();
    }

    move(leftPressed, rightPressed) {
        if (leftPressed) {
            this.playerAngle -= this.turningSpeed;
        } else if (rightPressed) {
            this.playerAngle += this.turningSpeed;
        }

        this.x += this.playerSpeed * Math.cos(this.playerAngle);
        this.y += this.playerSpeed * Math.sin(this.playerAngle);

        // if (this.x < 0) {
        //     this.x = CANVAS_WIDTH;
        // } else if (this.x > CANVAS_WIDTH) {
        //     this.x = 0;
        // }

        // if (this.y < 0) {
        //     this.y = CANVAS_HEIGHT;
        // } else if (this.y > CANVAS_HEIGHT) {
        //     this.y = 0;
        // }

        if ((gameIndex - this.lastTrailSkip) > 50 && Math.floor(Math.random() * 100) == 1) {
            this.hasTrail = false;
            this.lastTrailSkip = gameIndex;
            this.trail.createSegment();
            setTimeout(() => {
                this.hasTrail = true;
            }, 200);
        }
        
        if (this.hasTrail) {
            const trailPoint = new TrailPoint(this.x, this.y, ctx, playerRadius, gameIndex, this.color);
            this.trail.addPoint(trailPoint);
        }
    }
}