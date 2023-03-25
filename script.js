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

const plate = new Plate({
    startingPosition: { x: gap, y: canvas.height - Plate.size.y - gap },
    ctx,
});

const ball = new Ball({ startingPosition: { x: 100, y: 270 }, ctx: ctx });
function animate() {
    window.requestAnimationFrame(animate);
    drawEveryThing();
    detectCollisions();
    move();
}

function detectCollisions() {
    if (
        ball.pos.x + Ball.size > canvas.width ||
        ball.pos.y + Ball.size > canvas.height ||
        ball.pos.x - Ball.size < 0 ||
        ball.pos.y - Ball.size < 0
    ) {
        ball.collide();
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
