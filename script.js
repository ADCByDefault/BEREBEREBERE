/**@type {Array} */
const blockMap = divideInSubArrary(blockMapArray, 30);
/**@type {Array} */
const brickMap = divideInSubArrary(brickMapArray, 30);
/**@type {HTMLCanvasElement} */
const canvas = document.querySelector("#canvas");
/**@type {CanvasRenderingContext2D} */
const ctx = canvas.getContext("2d");
const brickSize = 8;
const gap = 2;
canvas.height = brickMap.length * (brickSize + gap);
canvas.width = brickMap[0].length * (brickSize + gap);

/**@param {Array} arr */
function divideInSubArrary(arr, length) {
    /**@type {Array} */
    let tarr = [];
    for (let i = 0; i < length; i += 1) {
        /**@type {Array} */
        let tarr2 = [];
        tarr2.push(arr.slice(i * length, i * length + length));
        tarr.push(...tarr2);
    }
    return tarr;
}
const blocks = blockMap.map((b, i) => {
    let t = [];
    b.forEach((be, ie) => {
        if (be == 1) {
            t.push(new Block({ x: ie * 10, y: i * 10, ctx }));
        }
    });
    return t;
});

const bricks = brickMap.map((b, i) => {
    let t = [];
    b.forEach((be, ie) => {
        if (be == 785) {
            t.push(new Brick({ x: ie * 10, y: i * 10, ctx: ctx }));
        }
    });
    return t;
});

const keys = {
    left: false,
    right: false,
};

/**
 * @type {Plate} plate
 */
const plate = new Plate({
    startingPosition: { x: gap, y: canvas.height - Plate.size.y - gap },
    ctx,
});

const ball = new Ball({ startingPosition: { x: 100, y: 270 }, ctx: ctx });
let framereq = null;
function animate() {
    framereq = window.requestAnimationFrame(animate);
    drawEveryThing();
    detectCollisions();
    move();
}

function detectCollisions() {
    detectCollisioneOuterBox();
    detectPlateCollision();
    detectBrickCollision();
    detectBlockCollision();
}

function detectBrickCollision() {
    bricks.forEach((r, i) => {
        r.forEach((b, j) => {
            let c = isCollide(b);
            if (c) {
                ball.collide(b.lastDir);
                bricks[i].splice(j, 1);
                return;
            }
        });
    });
}

function detectBlockCollision() {
    blocks.forEach((r, i) => {
        r.forEach((b, j) => {
            let c = isCollide(b);
            if (c) {
                let ballb = ball;
                // debugger;
                ball.collide(b.lastDir);
                // debugger;
                return;
            }
        });
    });
}

/**
 *
 * @param {Brick} b
 * @returns
 */
function isCollide(b) {
    let x = clamp(b.x + 3, b.x + b.size + 3, ball.pos.x);
    let y = clamp(b.y + 3, b.y + b.size + 3, ball.pos.y);
    let dis = Math.sqrt(
        Math.pow(x - ball.pos.x, 2) + Math.pow(y - ball.pos.y, 2)
    );
    if (dis <= ball.size) {
        return true;
    } else {
        let dir = getSingleCollisionDirection(x, y, ball.pos.x, ball.pos.y);

        b.setLastDir(dir);
    }
    return false;
}

function detectPlateCollision() {
    let x = clamp(plate.pos.x, plate.pos.x + plate.size.x, ball.pos.x);
    let y = clamp(plate.pos.y, plate.pos.y + plate.size.y, ball.pos.y);
    let dis = Math.sqrt(
        Math.pow(x - ball.pos.x, 2) + Math.pow(y - ball.pos.y, 2)
    );
    if (dis <= ball.size) {
        ball.collide(plate.lastDir);
    } else {
        let dir = getCollisionDirection(x, y, ball.pos.x, ball.pos.y);
        plate.setLastDir(dir);
    }
}

function getCollisionDirection(x1, y1, x2, y2) {
    let where = "";
    if (x1 < x2) {
        where += "right,";
    }
    if (x1 > x2) {
        where += "left,";
    }
    if (y1 > y2) {
        where += "bottom,";
    }
    if (y1 < y2) {
        where += "top,";
    }
    return where;
}

function getSingleCollisionDirection(x1, y1, x2, y2) {
    let where = "";
    if (x1 < x2) {
        where = "right";
    }
    if (x1 > x2) {
        where = "left";
    }
    if (y1 > y2) {
        where = "bottom";
    }
    if (y1 < y2) {
        where = "top";
    }
    return where;
}

function clamp(min, max, value) {
    if (min > value) {
        return min;
    }
    if (max < value) {
        return max;
    }
    return value;
}

function drawLine(x1, y1, x2, y2) {
    ctx.save();
    ctx.strokeStyle = "white";
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    ctx.closePath();
    ctx.restore();
}

function detectCollisioneOuterBox() {
    if (ball.pos.y - Ball.size < 0) {
        ball.collide("top");
    }
    if (ball.pos.x + Ball.size > canvas.width) {
        ball.collide("right");
    }
    if (ball.pos.x - Ball.size < 0) {
        ball.collide("left");
    }
    if (ball.pos.y - Ball.size > canvas.height) {
        ball.collide("bottom");
        // window.cancelAnimationFrame(framereq);
        // alert("Game Over");
        // location.reload();
    }
}

function drawEveryThing() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    blocks.forEach((r) => {
        r.forEach((b) => {
            b.draw();
        });
    });
    bricks.forEach((r) => {
        r.forEach((b) => {
            b.draw();
        });
    });
    plate.draw();
    ball.draw();
}

function move() {
    ball.move();
    if (keys.left) {
        if (plate.pos.x - Plate.speed < 0) {
            return;
        }
        plate.pos.x -= Plate.speed;
    }
    if (keys.right) {
        if (plate.pos.x + Plate.size.x + Plate.speed > canvas.width) {
            return;
        }
        plate.pos.x += Plate.speed;
    }
}

window.addEventListener("keydown", (e) => {
    let key = e.key.toLocaleLowerCase();
    switch (key) {
        case "arrowleft":
        case "a":
            keys.left = true;
            break;

        case "arrowright":
        case "d":
            keys.right = true;
            break;

        default:
            break;
    }
});
window.addEventListener("keyup", (e) => {
    let key = e.key.toLocaleLowerCase();
    switch (key) {
        case "arrowleft":
        case "a":
            keys.left = false;
            break;

        case "arrowright":
        case "d":
            keys.right = false;
            break;

        default:
            break;
    }
});

animate();
