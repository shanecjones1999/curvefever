class Player {
    constructor(ctx, radius, id, color) {
        this.x = Math.floor(Math.random() * (CANVAS_WIDTH - 200)) + 100;
        this.y = Math.floor(Math.random() * (CANVAS_HEIGHT - 200)) + 100;
        this.ctx = ctx;
        this.color = color;
        this.playerAngle = Math.random() * 2 * Math.PI;
        this.trail = new Trail();
        this.trail.createSegment();
        this.size = radius;
        this.turningSpeed = 0.045;
        this.playerSpeed = 2;
        this.id = id
        this.lastTrailSkip = immuneLength;
        this.hasTrail = false;
    }

    draw() {
        if (gameIndex < immuneLength / 2) {
            this.drawArrow();
        }
        
        this.trail.draw(this.ctx, this.size, this.color);
        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        this.ctx.fillStyle = this.color
        this.ctx.fill();
        this.ctx.closePath();
    }

    drawArrow() {
        const arrowWidth = 10,
            arrowLength = 20,
            arrowToPlayerDistance = 50;

        this.ctx.save(); // Save the current canvas state
    
        const arrowTipX = this.x + arrowToPlayerDistance * Math.cos(this.playerAngle);
        const arrowTipY = this.y + arrowToPlayerDistance * Math.sin(this.playerAngle);
    
        this.ctx.translate(arrowTipX, arrowTipY);
    
        this.ctx.rotate(this.playerAngle + Math.PI);
    
        this.ctx.fillStyle = this.color;
        this.ctx.beginPath();
        this.ctx.moveTo(0, 0);
        this.ctx.lineTo(arrowLength, arrowWidth / 2);
        this.ctx.lineTo(arrowLength, -arrowWidth / 2);
        this.ctx.closePath();
        this.ctx.fill();
    
        this.ctx.restore();
    }

    move(leftPressed, rightPressed) {
        if (leftPressed) {
            this.playerAngle -= this.turningSpeed;
        } else if (rightPressed) {
            this.playerAngle += this.turningSpeed;
        }

        if (gameIndex == immuneLength) {
            this.hasTrail = true;
        }

        this.x += this.playerSpeed * Math.cos(this.playerAngle);
        this.y += this.playerSpeed * Math.sin(this.playerAngle);

        if (gameIndex > immuneLength && (gameIndex - this.lastTrailSkip) > 30 && Math.floor(Math.random() * 100) == 1) {
            this.hasTrail = false;
            this.lastTrailSkip = gameIndex;
            this.trail.createSegment();
            setTimeout(() => {
                this.hasTrail = true;
            }, 175);
        }
        
        if (gameIndex >= immuneLength && this.hasTrail) {
            const trailPoint = new TrailPoint(this.x, this.y, ctx, playerRadius, gameIndex, this.color);
            this.trail.addPoint(trailPoint);
        }
    }

    isOutOfBounds() {
        if (!this.hasTrail) {
            return false;
        }
        const OOB = playerRadius/2 + 1;

        if (this.x <= 0 + OOB || this.x >= CANVAS_WIDTH - OOB || this.y <= 0 + OOB || this.y >= CANVAS_HEIGHT - OOB) {
            return true;
         }
     
         return false;
    }
}