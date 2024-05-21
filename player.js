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
        this.powerUps = this.initializePowerUps();
    }

    initializePowerUps() {
        const powerUpDictionary = {};

        for (const key in PowerUpType) {
            powerUpDictionary[PowerUpType[key]] = [];
            
        }

        return powerUpDictionary;
    }

    decrementPowerUpDurations() {
        for (const value in PowerUpType) {
            const key = PowerUpType[value];
            for (let i = 0; i < this.powerUps[key].length; i++) {
                this.powerUps[key][i] -= 1;
            }
            this.powerUps[key] = this.powerUps[key].filter(p => p > 0);
        }
    }

    addPowerUp(type) {
        const powerUpDuration = 250;
        this.powerUps[type].push(powerUpDuration);
    }

    speedUpMultiplier() {
        return Math.pow(2, this.powerUps[PowerUpType.SpeedUp].length);
    }

    getSpeed() {
        return this.speed * this.speedUpMultiplier() / this.slowDownMultiplier();
    }

    slowDownMultiplier() {
        return Math.pow(2, this.powerUps[PowerUpType.SlowDown].length);
    }

    thickLineMultiplier() {
        return Math.pow(2, this.powerUps[PowerUpType.ThickLine].length);
    }

    thinLineMultiplier() {
        return Math.pow(2, this.powerUps[PowerUpType.ThinLine].length);
    }

    getSize() {
        return this.size * this.thickLineMultiplier() / this.thinLineMultiplier();
    }

    hasReverseControls() {
        return this.powerUps[PowerUpType.Reverse].length > 0;
    }

    hasFloatPowerUp() {
        return this.powerUps[PowerUpType.Float].length > 0;
    }

    hasSharpTurns() {
        return this.powerUps[PowerUpType.SharpTurns].length > 0;
    }

    getAngle() {
        if (this.hasSharpTurns()) {
            return Math.PI;
        }

        return this.turningSpeed; // * this.speedUpMultiplier() 
    }

    canWrap() {
        return this.powerUps[PowerUpType.Wrap].length > 0;
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
        let color = this.hasReverseControls() ? "cyan" : this.color,
            size = this.getSize();

        
        this.trail.draw(this.ctx, this.color);

        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, size, 0, Math.PI * 2);
        this.ctx.fillStyle = color;
        this.ctx.fill();

        if (this.canWrap()) {
            this.giveYellowBorder();
        }

        this.ctx.closePath();

        this.highlightFrontArea();
    }

    giveYellowBorder() {
        this.ctx.lineWidth = 2;
        this.ctx.strokeStyle = "yellow";
        this.ctx.stroke();
    }

    isOverlappingPoint(point) {
        if (!this.hasTrail || this.hasFloatPowerUp()) {
            return false;
        }

        const viewAngle = Math.PI,
            viewDistance = this.getSize() + point.size;

        // Calculate the vector from the player to the point
        const vectorX = point.x - this.x;
        const vectorY = point.y - this.y;

        // Calculate the distance from the this to the point
        const distance = Math.sqrt(vectorX * vectorX + vectorY * vectorY);

        // Check if the point is within the view distance
        if (distance > viewDistance) {
            return false;
        }

        // Normalize the vector
        const normalizedVectorX = vectorX / distance;
        const normalizedVectorY = vectorY / distance;

        // Calculate the this's direction vector
        const directionX = Math.cos(this.playerAngle);
        const directionY = Math.sin(this.playerAngle);

        // Calculate the dot product between the direction and the vector to the point
        const dotProduct = normalizedVectorX * directionX + normalizedVectorY * directionY;

        // Calculate the angle between the direction and the vector to the point
        const angle = Math.acos(dotProduct);

        // Check if the angle is within half the view angle
        return angle <= (viewAngle / 2);
    }

    highlightFrontArea() {
        const viewAngle = Math.PI;
        const startAngle = this.playerAngle - viewAngle / 2;
        const endAngle = this.playerAngle + viewAngle / 2;

        const viewDistance = this.getSize();
    
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.arc(this.x, this.y, viewDistance, startAngle, endAngle);
        ctx.lineTo(this.x, this.y);
        ctx.fillStyle = 'rgba(255, 255, 0, 0.5)';
        ctx.fill();
        ctx.closePath();
    }

    reset() {
        this.x = Math.floor(Math.random() * (CANVAS_WIDTH - 200)) + 100;
        this.y = Math.floor(Math.random() * (CANVAS_HEIGHT - 200)) + 100;
        this.playerAngle = Math.random() * 2 * Math.PI;
        this.resetTrail();
        this.lastTrailSkip = immuneLength;
        this.hasTrail = false;
        this.eliminated = false;
        this.leftPressed = false;
        this.rightPressed = false;
        this.turningSpeed = 0.045;
        this.speed = 2;
        this.size = playerRadius;

        this.powerUps = this.initializePowerUps();
    }

    reverseControls() {
        const tempLeft = this.leftKey;
        this.leftKey = this.rightKey;
        this.rightKey = tempLeft;
    }

    resetTrail() {
        this.trail = new Trail();
        this.trail.createSegment();
    }

    drawArrow() {
        const arrowWidth = 10,
            arrowLength = 20,
            arrowToPlayerDistance = 50;

        this.ctx.save();
    
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
        const speed = this.getSpeed(),
            angleIncrement = this.getAngle(),
            size = this.getSize(),
            leftPressed = this.hasReverseControls() ? this.rightPressed : this.leftPressed,
            rightPressed = this.hasReverseControls() ? this.leftPressed : this.rightPressed;

        if (leftPressed) {
            this.playerAngle -= angleIncrement;
        } else if (rightPressed) {
            this.playerAngle += angleIncrement;
        }

        if (this.hasSharpTurns()) {
            this.leftPressed = false;
            this.rightPressed = false;
        }

        if (gameIndex == immuneLength) {
            this.hasTrail = true;
        }

        this.x += speed * Math.cos(this.playerAngle);
        this.y += speed * Math.sin(this.playerAngle);

        if (this.canWrap()) {
            this.setPosition();
        }

        if (this.shouldSkip()) {
            this.hasTrail = false;
            this.lastTrailSkip = gameIndex;
        }

        if (!this.hasFloatPowerUp() && !this.hasTrail && gameIndex > immuneLength) {
            const dist = this.distanceFromHeadToRecentTrail();
            if (dist >= Math.max(size * 8, playerRadius * 8)) {
                this.trail.createSegment();
                this.hasTrail = true;
            }
        }
        
        if (gameIndex >= immuneLength && this.hasTrail && !this.hasFloatPowerUp()) {
            const trailPoint = new TrailPoint(this.x, this.y, ctx, size, gameIndex, this.color);
            this.trail.addPoint(trailPoint);
        }


        this.decrementPowerUpDurations();
    }

    distanceFromHeadToRecentTrail() {
        const lastPoint = this.trail.lastSegment().lastPoint();
        
        if (!lastPoint) {
            return Number.MAX_SAFE_INTEGER;
        }

        return this.distanceBetweenPoints(this.x, this.y, lastPoint.x, lastPoint.y);

    }

    distanceBetweenPoints(x1, y1, x2, y2) {
        const dx = x2 - x1,
            dy = y2 - y1,
            distance = Math.sqrt(dx * dx + dy * dy);

        return distance;
    }

    shouldSkip() {
        return gameIndex > immuneLength && (gameIndex - this.lastTrailSkip) > (this.getSize() * 6) && Math.floor(Math.random() * 100) == 1;
    }

    isOutOfBounds() {
        if (this.hasFloatPowerUp() || this.canWrap() || !this.hasTrail) {
            return false;
        }
        const margin = this.getSize();

        if (this.x <= 0 + margin || this.x >= CANVAS_WIDTH - margin || this.y <= 0 + margin || this.y >= CANVAS_HEIGHT - margin) {
            return true;
         }
     
         return false;
    }

    // Utility method if player can pass through walls.
    setPosition() {
        if (this.x < 0) {
            this.x = CANVAS_WIDTH;
            this.trail.createSegment();
        } else if (this.x > CANVAS_WIDTH) {
            this.x = 0;
            this.trail.createSegment();
        }

        if (this.y < 0) {
            this.y = CANVAS_HEIGHT;
            this.trail.createSegment();
        } else if (this.y > CANVAS_HEIGHT) {
            this.y = 0;
            this.trail.createSegment();
        }
    }
}