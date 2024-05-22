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

        // for (let i = 0; i < this.points.length; i++) {
        //     ctx.beginPath();
        //     ctx.arc(this.points[i].x, this.points[i].y, this.points[i].size, 0, Math.PI * 2);
        //     ctx.fillStyle = 'rgba(200, 100, 0, 0.8)';
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