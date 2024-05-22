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
        this.powerUpDuration = 250;
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
                this.powerUps[key][i].duration -= 1;
            }
            this.powerUps[key] = this.powerUps[key].filter(p => p.duration > 0);
        }
    }

    addPowerUp(powerUpType, applyType) {
        const color = applyType == ApplyType.Self ? 'rgba(2, 163, 12, 0.5)' : applyType == ApplyType.Others ? 'rbga(242, 0, 0, 0.5)' : 'rgba(88, 66, 255, 0.6)';
        this.powerUps[powerUpType].push({ duration: this.powerUpDuration, color: color });
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
            return Math.PI / 2;
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
        const size = this.getSize();
        
        this.trail.draw(this.ctx, this.color);

        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, size, 0, Math.PI * 2);
        this.ctx.fillStyle = this.color;
        this.ctx.fill();
        this.ctx.closePath();

        this.drawPowerUpCircles();
    }

    drawPowerUpCircles() {
        let i = 1;
        
        for (const value in PowerUpType) {
            const key = PowerUpType[value];
            for (let j = 0; j < this.powerUps[key].length; j++) {
                const percentage = this.powerUps[key][j].duration / this.powerUpDuration,
                    endAngle = (percentage) * 2 * Math.PI;
                
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.getSize() + (i * 10), 0, endAngle);
                ctx.strokeStyle = this.powerUps[key][j].color;
                ctx.lineWidth = 8;
                ctx.stroke();
                ctx.closePath();
                
                i += 1;
            }
        }
        
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

    // Updated collision

    isCircleIntersectingLineWithDirection(point1, point2, viewAngle = Math.PI) {
        const { x: cx, y: cy, playerAngle } = this,
            radius = this.getSize() + point2.size;
    
        // Calculate the perpendicular distance from the circle center to the line segment
        const lineLength = Math.sqrt((point2.x - point1.x) ** 2 + (point2.y - point1.y) ** 2);
        const dotProduct = (((cx - point1.x) * (point2.x - point1.x)) + ((cy - point1.y) * (point2.y - point1.y))) / (lineLength ** 2);
        const closestX = point1.x + (dotProduct * (point2.x - point1.x));
        const closestY = point1.y + (dotProduct * (point2.y - point1.y));
    
        // Calculate the distance from the circle center to the closest point on the line segment
        const distanceToClosest = Math.sqrt((closestX - cx) ** 2 + (closestY - cy) ** 2);
    
        // Check if the closest point is within the segment bounds and the circle intersects with the segment
        const withinSegmentBounds = (closestX >= Math.min(point1.x, point2.x) && closestX <= Math.max(point1.x, point2.x)) &&
                                    (closestY >= Math.min(point1.y, point2.y) && closestY <= Math.max(point1.y, point2.y));
    
        if (withinSegmentBounds && distanceToClosest <= radius) {
            // Check if the closest point is within the player's view angle
            const vectorToClosestX = closestX - cx;
            const vectorToClosestY = closestY - cy;
            const distanceToPoint = Math.sqrt(vectorToClosestX * vectorToClosestX + vectorToClosestY * vectorToClosestY);
            const normalizedVectorX = vectorToClosestX / distanceToPoint;
            const normalizedVectorY = vectorToClosestY / distanceToPoint;
    
            const directionX = Math.cos(playerAngle);
            const directionY = Math.sin(playerAngle);
    
            const dotProductDirection = normalizedVectorX * directionX + normalizedVectorY * directionY;
            const angle = Math.acos(dotProductDirection);
    
            return angle <= (viewAngle / 2);
        }
    
        return false;
    }
}