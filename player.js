class Player {
    constructor(ctx, radius, id, color) {
        this.keyDownHandler = this.keyDownHandler.bind(this);
        this.keyUpHandler = this.keyUpHandler.bind(this);

        this.x = Math.floor(Math.random() * (CANVAS_WIDTH - 200)) + 100;
        this.y = Math.floor(Math.random() * (CANVAS_HEIGHT - 200)) + 100;
        this.leftKey = undefined;
        this.rightKey = undefined;
        this.leftPressed = false;
        this.rightPressed = false;
        this.ctx = ctx;
        this.color = color;
        this.playerAngle = Math.random() * 2 * Math.PI;
        this.trail = new Trail();
        this.trail.createSegment();
        this.size = radius;
        this.turningSpeed = 0.045;
        this.speed = 2;
        this.id = id
        this.lastTrailSkip = immuneLength;
        this.hasTrail = false;
        this.eliminated = false;
        this.score = 0;
    }

    setKeys(left, right) {
        this.leftKey = left;
        this.rightKey = right;

        this.setListeners();
    }

    setListeners() {
        document.addEventListener("keydown", this.keyDownHandler);
        document.addEventListener("keyup", this.keyUpHandler);
    }

    keyDownHandler(event) {
        this.setKeyDown(event.key);
    }

    setKeyDown(key) {
        if (key === this.leftKey) {
            this.leftPressed = true;
        } else if (key === this.rightKey) {
            this.rightPressed = true;
        }
    }

    keyUpHandler(event) {
        this.setKeyUp(event.key);
    }

    setKeyUp(key) {
        if (key === this.leftKey) {
            this.leftPressed = false;
        } else if (key === this.rightKey) {
            this.rightPressed = false;
        }
    }

    draw() {
        if (gameIndex < immuneLength / 2) {
            this.drawArrow();
        }
        
        this.trail.draw(this.ctx, this.size, this.color);
        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        this.ctx.fillStyle = this.color;
        this.ctx.fill();
        this.ctx.closePath();
    }

    reset() {
        this.x = Math.floor(Math.random() * (CANVAS_WIDTH - 200)) + 100;
        this.y = Math.floor(Math.random() * (CANVAS_HEIGHT - 200)) + 100;
        this.playerAngle = Math.random() * 2 * Math.PI;
        this.trail = new Trail();
        this.trail.createSegment();
        this.lastTrailSkip = immuneLength;
        this.hasTrail = false;
        this.eliminated = false;
        this.leftPressed = false;
        this.rightPressed = false;
        this.turningSpeed = 0.045;
        this.speed = 2;
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

    move() {
        if (this.leftPressed) {
            this.playerAngle -= this.turningSpeed;
        } else if (this.rightPressed) {
            this.playerAngle += this.turningSpeed;
        }

        if (gameIndex == immuneLength) {
            this.hasTrail = true;
        }

        this.x += this.speed * Math.cos(this.playerAngle);
        this.y += this.speed * Math.sin(this.playerAngle);

        if (this.shouldSkip()) {
            this.hasTrail = false;
            this.lastTrailSkip = gameIndex;
        }

        if (!this.hasTrail && gameIndex > immuneLength) {
            const dist = this.distanceFromHeadToRecentTrail();
            if (dist >= this.size * 6) {
                this.trail.createSegment();
                this.hasTrail = true;
            }
            //this.trail.createSegment();
        }
        
        if (gameIndex >= immuneLength && this.hasTrail) {
            const trailPoint = new TrailPoint(this.x, this.y, ctx, playerRadius, gameIndex, this.color);
            this.trail.addPoint(trailPoint);
        }
    }

    distanceFromHeadToRecentTrail() {
        const lastPoint = this.trail.lastSegment().lastPoint();
        return this.distanceBetweenPoints(this.x, this.y, lastPoint.x, lastPoint.y);

    }

    distanceBetweenPoints(x1, y1, x2, y2) {
        const dx = x2 - x1,
            dy = y2 - y1,
            distance = Math.sqrt(dx * dx + dy * dy);

        return distance;
    }

    shouldSkip() {
        return gameIndex > immuneLength && (gameIndex - this.lastTrailSkip) > minTrailGap && Math.floor(Math.random() * 100) == 1;
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