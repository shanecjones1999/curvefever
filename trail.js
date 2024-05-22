class Trail {
    constructor() {
        this.segments = [];
    }

    addPoint(point) {
        const lastPoint = this.lastSegment().lastPoint();
        if (lastPoint && lastPoint.size != point.size) {
            this.createSegment();
            point.x = lastPoint.x;
            point.y = lastPoint.y;
        }
        this.segments[this.segments.length - 1].addPoint(point);
    }

    lastSegment() {
        return this.segments[this.segments.length - 1];
    }

    createSegment() {
        const segment = new TrailSegment();
        this.segments.push(segment);
    }

    addSegment(segment) {
        this.segments.addSegment(segment);
    }

    draw(ctx, color) {
        for (let i = 0; i < this.segments.length; i++) {
            this.segments[i].draw(ctx, color);
        }
    }
}

class TrailSegment {
    constructor() {
        this.points = [];
    }

    addPoint(point) {
        this.points.push(point);
    }

    lastPoint() {
        return this.points[this.points.length - 1];
    }

    draw(ctx, color) {
        if (this.points.length < 2) {
            return;
        }

        // for (let i = 1; i < this.points.length; i++) {
        //     this.drawBoxAroundLine(this.points[i-1], this.points[i], this.points[i].size * 2 + 5);
        // }

        // for (let i = 0; i < this.points.length; i++) {
        //     ctx.beginPath();
        //     ctx.arc(this.points[i].x, this.points[i].y, this.points[i].size, 0, Math.PI * 2);
        //     ctx.fillStyle = 'rgba(0, 200, 0, 0.8)';
        //     ctx.fill();
        //     ctx.closePath();
        // }

        ctx.beginPath();
        ctx.strokeStyle = color;

        ctx.moveTo(this.points[0].x, this.points[0].y);
        
        for (let i = 1; i < this.points.length; i++) {
            ctx.lineWidth = this.points[i].size * 2;
            ctx.lineTo(this.points[i].x, this.points[i].y);
        }

        ctx.stroke();
        ctx.closePath();
    }

    drawBoxAroundLine(point1, point2, boxWidth) {
        // Calculate the direction of the line
        const dx = point2.x - point1.x;
        const dy = point2.y - point1.y;
        
        // Calculate the length of the line
        const length = Math.sqrt(dx * dx + dy * dy);
    
        // Normalize the direction
        const nx = dx / length;
        const ny = dy / length;
    
        // Calculate the perpendicular (normal) direction
        const perpX = -ny;
        const perpY = nx;
    
        // Half width of the box
        const halfBoxWidth = boxWidth / 2;
    
        // Calculate the corners of the rectangle
        const corner1 = {
            x: point1.x + perpX * halfBoxWidth,
            y: point1.y + perpY * halfBoxWidth
        };
        const corner2 = {
            x: point1.x - perpX * halfBoxWidth,
            y: point1.y - perpY * halfBoxWidth
        };
        const corner3 = {
            x: point2.x + perpX * halfBoxWidth,
            y: point2.y + perpY * halfBoxWidth
        };
        const corner4 = {
            x: point2.x - perpX * halfBoxWidth,
            y: point2.y - perpY * halfBoxWidth
        };
    
        // Draw the box
        ctx.beginPath();
        ctx.moveTo(corner1.x, corner1.y);
        ctx.lineTo(corner3.x, corner3.y);
        ctx.lineTo(corner4.x, corner4.y);
        ctx.lineTo(corner2.x, corner2.y);
        ctx.closePath();
    
        // Set the fill color and stroke color for the box
        ctx.fillStyle = 'rgba(255, 255, 0, 0.3)'; // Example: semi-transparent yellow
        ctx.strokeStyle = 'yellow';
        ctx.lineWidth = 2;
    
        // Fill and stroke the box
        ctx.fill();
        ctx.stroke();
    }
}

class TrailPoint {
    constructor(x, y, ctx, radius, idx, color) {
        this.x = x;
        this.y = y;
        this.ctx = ctx;
        this.color = color;
        this.size = radius;
        this.idx = idx;
    }
}