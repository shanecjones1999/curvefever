class Player {
    constructor(x, y, ctx, radius, id, color) {
        this.x = x;
        this.y = y;
        this.ctx = ctx;
        this.color = color;
        this.playerAngle = Math.PI / 2;
        this.trail = [];
        this.size = radius;
        this.turningSpeed = 0.045;
        this.playerSpeed = 2;
        this.id = id
        this.hasTrail = true;
    }

    draw() {
        for (let i = 0; i < this.trail.length; i++) {
            this.trail[i].draw();
        }
        //this.drawTrail();
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

        if (this.x < 0) {
            this.x = CANVAS_WIDTH;
        } else if (this.x > CANVAS_WIDTH) {
            this.x = 0;
        }

        if (this.y < 0) {
            this.y = CANVAS_HEIGHT;
        } else if (this.y > CANVAS_HEIGHT) {
            this.y = 0;
        }

        // if (Math.floor(Math.random() * 100) == 1) {
        //     this.hasTrail = false;
        //     setTimeout(() => {
        //         this.hasTrail = true;
        //     }, 225);
        // }
        
        if (this.hasTrail) {
            const trail = new TrailPoint(this.x, this.y, ctx, playerRadius, gameIndex, this.color);
            this.trail.push(trail);
        }
    }

    // drawTrail() {
    //     if (this.trail.length < 2) {
    //         return; // Not enough trail to draw a line
    //     }

    //     this.ctx.beginPath();
    //     this.ctx.strokeStyle = this.color;
    //     this.ctx.lineWidth = this.size * 2; // Adjust line width as needed

    //     this.ctx.moveTo(this.trail[0].x, this.trail[0].y);
    //     for (let i = 1; i < this.trail.length; i++) {
    //         this.ctx.lineTo(this.trail[i].x, this.trail[i].y);
    //     }

    //     this.ctx.stroke();
    //     this.ctx.closePath();
    // }
}