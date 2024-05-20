class Trail {
    constructor() {
        this.segments = [];
    }

    addPoint(point) {
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

    draw(ctx, color, sz) {
        for (let i = 0; i < this.segments.length; i++) {
            this.segments[i].draw(ctx, color, sz);
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

    draw(ctx, color, sz) {
        for (let i = 0; i < this.points.length; i++) {

            if (!(gameIndex - this.points[i].idx > sz * 2)) {
                color = "cyan";
            }

            ctx.beginPath();
            ctx.arc(this.points[i].x, this.points[i].y, this.points[i].size, 0, Math.PI * 2);
            ctx.fillStyle = color;
            ctx.fill();
            ctx.closePath();
        }
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