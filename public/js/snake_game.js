const $canvas = $("canvas");
const ctx = $canvas[0].getContext("2d");

const $score = $(".score--value");
const $finalScore = $(".final-score > span");
const $menu = $(".menu-screen");
const $buttonPlay = $(".btn-play");

const audio = new Audio("/assets/audio.mp3");

const size = 30;
const initialPosition = { x: 270, y: 240 };

let snake = [initialPosition];

const incrementScore = () => {
    $score.text(+$score.text() + 10);
};

const randomNumber = (min, max) => {
    return Math.round(Math.random() * (max - min) + min);
};

const randomPosition = () => {
    const number = randomNumber(0, $canvas.width() - size);
    return Math.round(number / 30) * 30;
};

const randomColor = () => {
    const red = randomNumber(0, 255);
    const green = randomNumber(0, 255);
    const blue = randomNumber(0, 255);

    return `rgb(${red}, ${green}, ${blue})`;
};

const food = {
    x: randomPosition(),
    y: randomPosition(),
    color: randomColor(),
};

let direction, loopId;

const drawFood = () => {
    const { x, y, color } = food;

    ctx.shadowColor = color;
    ctx.shadowBlur = 6;
    ctx.fillStyle = color;
    ctx.fillRect(x, y, size, size);
    ctx.shadowBlur = 0;
};

const drawSnake = () => {
    ctx.fillStyle = "#ddd";

    snake.forEach((position, index) => {
        if (index === snake.length - 1) {
            ctx.fillStyle = "white";
        }

        ctx.fillRect(position.x, position.y, size, size);
    });
};

const moveSnake = () => {
    if (!direction) return;

    const head = snake[snake.length - 1];

    if (direction === "right") {
        snake.push({ x: head.x + size, y: head.y });
    } else if (direction === "left") {
        snake.push({ x: head.x - size, y: head.y });
    } else if (direction === "down") {
        snake.push({ x: head.x, y: head.y + size });
    } else if (direction === "up") {
        snake.push({ x: head.x, y: head.y - size });
    }

    snake.shift();
};

const drawGrid = () => {
    ctx.lineWidth = 1;
    ctx.strokeStyle = "#191919";

    for (let i = 30; i < $canvas.width(); i += 30) {
        ctx.beginPath();
        ctx.lineTo(i, 0);
        ctx.lineTo(i, $canvas.height());
        ctx.stroke();

        ctx.beginPath();
        ctx.lineTo(0, i);
        ctx.lineTo($canvas.width(), i);
        ctx.stroke();
    }
};

const checkEat = () => {
    const head = snake[snake.length - 1];

    if (head.x === food.x && head.y === food.y) {
        incrementScore();
        snake.push(head);
        audio.play();

        let x = randomPosition();
        let y = randomPosition();

        while (snake.find((position) => position.x === x && position.y === y)) {
            x = randomPosition();
            y = randomPosition();
        }

        food.x = x;
        food.y = y;
        food.color = randomColor();
    }
};

const checkCollision = () => {
    const head = snake[snake.length - 1];
    const canvasLimit = $canvas.width() - size;
    const neckIndex = snake.length - 2;

    const wallCollision =
        head.x < 0 || head.x > canvasLimit || head.y < 0 || head.y > canvasLimit;

    const selfCollision = snake.find((position, index) => {
        return index < neckIndex && position.x === head.x && position.y === head.y;
    });

    if (wallCollision || selfCollision) {
        gameOver();
    }
};

const gameOver = () => {
    direction = undefined;

    $menu.css("display", "flex");
    $finalScore.text($score.text());
    if(!localStorage.getItem("max-score-snake") || localStorage.getItem("max-score-snake") < $score.text()){
        localStorage.removeItem("max-score-snake")
        localStorage.setItem("max-score-snake", $score.text());
    }
    $canvas.css("filter", "blur(2px)");
};

const gameLoop = () => {
    clearInterval(loopId);

    ctx.clearRect(0, 0, $canvas.width(), $canvas.height());
    drawGrid();
    drawFood();
    moveSnake();
    drawSnake();
    checkEat();
    checkCollision();

    loopId = setTimeout(() => {
        gameLoop();
    }, 300);
};

gameLoop();

$(document).keydown(({ key }) => {
    if (key === "ArrowRight" && direction !== "left") {
        direction = "right";
    } else if (key === "ArrowLeft" && direction !== "right") {
        direction = "left";
    } else if (key === "ArrowDown" && direction !== "up") {
        direction = "down";
    } else if (key === "ArrowUp" && direction !== "down") {
        direction = "up";
    }
});

$buttonPlay.click(() => {
    $score.text("00");
    $menu.hide();
    $canvas.css("filter", "none");

    snake = [initialPosition];
});
