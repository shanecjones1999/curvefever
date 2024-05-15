class Trail {
    constructor() {
        this.segments = [];
    }

    addPoint(point) {
        this.segments[this.segments.length - 1].addPoint(point);
    }

    createSegment() {
        const segment = new TrailSegment();
        this.segments.push(segment);
    }

    addSegment(segment) {
        this.segments.addSegment(segment);
    }

    draw(ctx, size, color) {
        for (let i = 0; i < this.segments.length; i++) {
            this.segments[i].draw(ctx, size, color);
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

    draw(ctx, size, color) {
        if (this.points.length < 2) {
            return;
        }

        ctx.beginPath();
        ctx.strokeStyle = color;
        ctx.lineWidth = size * 2;

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
}