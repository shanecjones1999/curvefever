class Trail {
    constructor(ctx, size, color) {
        this.ctx = ctx;
        this.size = size;
        this.color = color;
        this.segments = [];
    }

    addPoint(point) {
        this.segments[this.segments.length - 1].push(point);
    }

    addSegment(segment) {
        this.segments.addSegment(segment);
    }

    draw() {
        for (let i = 0; i < this.segments.length; i++) {
            this.segments[i].draw(this.ctx, this.size, this.color);
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

    draw(color, size, ctx) {
        if (this.points.length < 2) {
            return; // Not enough points to draw a line
        }

        ctx.beginPath();
        ctx.strokeStyle = color;
        ctx.lineWidth = size * 2; // Adjust line width as needed

        ctx.moveTo(this.points[0].x, this.points[0].y);
        for (let i = 1; i < this.points.length; i++) {
            ctx.lineTo(this.points[i].x, this.points[i].y);
        }

        ctx.stroke();
        ctx.closePath();
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

    draw() {
        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        this.ctx.fillStyle = this.color;
        this.ctx.fill();
        this.ctx.closePath();
    }
}