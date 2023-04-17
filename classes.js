class Block {
    static size = 8;
    constructor({ x, y, ctx }) {
        this.x = x;
        this.y = y;
        /**@type {CanvasRenderingContext2D} */
        this.ctx = ctx;
        this.size = Block.size;
        this.lastDir = "";
    }
    setLastDir(dir) {
        this.lastDir = dir;
    }
    draw() {
        this.ctx.save;
        this.ctx.fillStyle = "red";
        this.ctx.fillRect(this.x, this.y, this.size, this.size);
        this.ctx.restore;
    }
}

class Brick {
    static size = 8;
    constructor({ x, y, ctx }) {
        this.x = x;
        this.y = y;
        /**@type {CanvasRenderingContext2D} */
        this.ctx = ctx;
        this.size = Brick.size;
        this.lastDir = "";
    }
    setLastDir(dir) {
        this.lastDir = dir;
    }
    draw() {
        this.ctx.save;
        this.ctx.fillStyle = "blue";
        this.ctx.fillRect(this.x, this.y, this.size, this.size);
        this.ctx.restore;
    }
}

class Ball {
    static speed = 2;
    static size = 5;
    static startingAngle = 30;
    static randomizzation = 2;
    constructor({ startingPosition, ctx }) {
        this.pos = startingPosition;
        /**@type {CanvasRenderingContext2D} */
        this.ctx = ctx;
        this.angle = Ball.startingAngle;
        this.size = Ball.size;
    }
    draw() {
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.fillStyle = "gray";
        this.ctx.arc(this.pos.x, this.pos.y, this.size, 0, 2 * Math.PI);
        this.ctx.closePath();
        this.ctx.fill();
        this.ctx.restore();
    }
    move() {
        this.pos.x += Ball.speed * Math.cos((this.angle * Math.PI) / 180);
        this.pos.y -= Ball.speed * Math.sin((this.angle * Math.PI) / 180);
    }
    collide(where) {
        where = where.split(",");
        where.forEach((d, i) => {
            if (d == "") {
                where.splice(i, 1);
            }
        });
        where = where[0];
        if (where.length == 2) {
            where = "bottom";
        }
        {
            switch (where) {
                case "top":
                case "block":
                    this.angle = 360 - this.angle;
                    break;
                case "bottom":
                    this.angle = 360 - this.angle;
                    break;
                case "left":
                case "side":
                    this.angle = 360 - this.angle + 180;
                    break;
                case "right":
                    this.angle = 360 - this.angle + 180;
                    break;
            }
        }
        if (this.angle >= 360) {
            this.angle -= 360;
        }
    }
}

class Plate {
    static size = { x: 60, y: 6 };
    static speed = 5;
    constructor({ startingPosition, ctx }) {
        this.pos = startingPosition;
        /**@type {CanvasRenderingContext2D} */
        this.ctx = ctx;
        this.size = Plate.size;
        this.lastDir = "";
    }
    setLastDir(dir) {
        this.lastDir = dir;
    }
    draw() {
        this.ctx.save();
        this.ctx.fillStyle = "gray";
        this.ctx.fillRect(this.pos.x, this.pos.y, this.size.x, this.size.y);
        this.ctx.restore();
    }
}
