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
            arrowLength = 20;

        this.ctx.save(); // Save the current canvas state
    
        // Calculate the coordinates of the arrow's tip based on player position and direction
        const arrowTipX = this.x + 50 * Math.cos(this.playerAngle);
        const arrowTipY = this.y + 50 * Math.sin(this.playerAngle);
    
        this.ctx.translate(arrowTipX, arrowTipY);
    
        // Rotate the canvas context by the angle (in radians) and an additional 180 degrees
        this.ctx.rotate(this.playerAngle + Math.PI);
    
        // Draw the arrow
        this.ctx.fillStyle = this.color;
        this.ctx.beginPath();
        this.ctx.moveTo(0, 0); // Arrow tip (origin)
        this.ctx.lineTo(arrowLength, arrowWidth / 2); // Right side of arrow
        this.ctx.lineTo(arrowLength, -arrowWidth / 2); // Left side of arrow
        this.ctx.closePath();
        this.ctx.fill();
    
        this.ctx.restore(); // Restore the canvas state to avoid affecting other drawings
    }

    move(leftPressed, rightPressed) {
        if (leftPressed) {
            this.playerAngle -= this.turningSpeed;
        } else if (rightPressed) {
            this.playerAngle += this.turningSpeed;
        }

        this.x += this.playerSpeed * Math.cos(this.playerAngle);
        this.y += this.playerSpeed * Math.sin(this.playerAngle);

        if ((gameIndex - this.lastTrailSkip) > 50 && Math.floor(Math.random() * 100) == 1) {
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
        const OOB = playerRadius/2 + 1;

        if (this.x <= 0 + OOB || this.x >= CANVAS_WIDTH - OOB || this.y <= 0 + OOB || this.y >= CANVAS_HEIGHT - OOB) {
            return true;
         }
     
         return false;
    }
}