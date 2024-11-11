let canvasEl = document.querySelector('#screen');
let ctx = canvasEl.getContext('2d');

const rope = "#a6491b"
const character = "#ff6b21"

let backgroundImage = new Image();
backgroundImage.src = '/img/backgroundTemple.png'; 

// Função para desenhar a imagem de fundo e os outros elementos
function drawBackground() {

    backgroundImage.onload = function() {

        ctx.drawImage(backgroundImage, 0, 0, canvasEl.width, canvasEl.height);

        drawElements();
    };
}

function drawStickFigure(x, y) {
    // Cabeça
    ctx.beginPath();
    ctx.arc(x, y, 10, 0, Math.PI * 2, true); 
    ctx.strokeStyle = character;
    ctx.stroke();

    // Corpo
    ctx.beginPath();
    ctx.moveTo(x, y + 10);
    ctx.lineTo(x, y + 30); 
    ctx.stroke();

    // Braço esquerdo
    ctx.beginPath();
    ctx.moveTo(x, y + 15); 
    ctx.lineTo(x - 10, y + 25); 
    ctx.stroke();

    // Braço direito
    ctx.beginPath();
    ctx.moveTo(x, y + 15); 
    ctx.lineTo(x + 10, y + 25); 
    ctx.stroke();

    // Perna esquerda
    ctx.beginPath();
    ctx.moveTo(x, y + 30); 
    ctx.lineTo(x - 10, y + 45); 
    ctx.stroke();

    // Perna direita
    ctx.beginPath();
    ctx.moveTo(x, y + 30); 
    ctx.lineTo(x + 10, y + 45); 
    ctx.stroke();
}

function drawElements() {

    ctx.fillStyle = rope;
    ctx.fillRect(450, 10, 3, 300);  

    let charX = 100;
    let charY = 300;

    drawStickFigure(charX, charY);
}

// Iniciar o desenho do fundo
drawBackground();

// Posição inicial da linha
let lineX = 150;     
let bottomX = 100;   
let direction = 1;   
let speed = 1;       
let maxMovement = 80;  
let score = 0;
let level = 1;

let defeat = false;

// Posição do personagem
let charX = bottomX + 20;
let charY = 300;
let fallSpeed = 5; 


ctx.lineWidth = 3;
ctx.lineCap = "round";

// Função de animação
function animateLine() {
    ctx.clearRect(0, 0, canvasEl.width, canvasEl.height);
    ctx.drawImage(backgroundImage, 0, 0, canvasEl.width, canvasEl.height);

    ctx.fillStyle = rope;
    ctx.fillRect(450, 10, 3, 300);

    charX = bottomX + 20;

    drawStickFigure(charX, charY);

    ctx.beginPath();
    ctx.moveTo(lineX, 10);  
    ctx.lineTo(bottomX, 310);
    ctx.strokeStyle = rope;
    ctx.stroke();

    bottomX += direction * speed;

    if (bottomX >= lineX + maxMovement || bottomX <= lineX - maxMovement) {
        direction *= -1;
    }

    if(!defeat){
        requestAnimationFrame(animateLine);
    }
}


animateLine();

// Função que desenha a animação da derrota (queda do personagem)

function drawDefeat() {
    function fall() {
        ctx.clearRect(0, 0, canvasEl.width, canvasEl.height);
        ctx.drawImage(backgroundImage, 0, 0, canvasEl.width, canvasEl.height);


        ctx.fillStyle = rope;
        ctx.fillRect(450, 120, 3, 200);

        ctx.beginPath();
        ctx.moveTo(lineX, 120);
        ctx.lineTo(bottomX, 320);
        ctx.strokeStyle = rope;
        ctx.stroke();

        drawStickFigure(charX, charY);

        charY += fallSpeed;

        if (charY < canvasEl.height - 10) {
            requestAnimationFrame(fall);
        } else {
            if(!localStorage.getItem("max-score-templeEscape") || localStorage.getItem("max-score-templeEscape") < score){
                localStorage.removeItem("max-score-templeEscape");
                localStorage.setItem("max-score-templeEscape", score);
            }
            $('#final-score').text(score);
            $('.menu-screen').css("display", "flex");

        }
    }

    fall();
}

function drawMove() {
    let startX = charX;
    let startY = charY;
    let endX = 450;
    let peakY = 120;
    let duration = 100;
    let t = 0;

    function moveInArc() {
        ctx.clearRect(0, 0, canvasEl.width, canvasEl.height);
        ctx.drawImage(backgroundImage, 0, 0, canvasEl.width, canvasEl.height);

        ctx.fillStyle = rope;
        ctx.fillRect(450, 10, 3, 300);

        ctx.beginPath();
        ctx.moveTo(lineX, 10);
        ctx.lineTo(bottomX, 310);
        ctx.strokeStyle = rope;
        ctx.stroke();

        let progress = t / duration;
        charX = startX + progress * (endX - startX);
        charY = startY - (4 * peakY * progress * (1 - progress));

        drawStickFigure(charX, charY);

        t++;

        if (t <= duration) {
            requestAnimationFrame(moveInArc);
        } else {
            moveStaticLine();
        }
    }

    moveInArc();
}

function moveStaticLine() {
    let startX = 450;
    let targetX = lineX;
    let duration = 50;
    let t = 0;

    function animateLineMove() {
        ctx.clearRect(0, 0, canvasEl.width, canvasEl.height);
        ctx.drawImage(backgroundImage, 0, 0, canvasEl.width, canvasEl.height);

        let progress = t / duration;
        let currentX = startX + progress * (targetX - startX);

        ctx.fillStyle = rope;
        ctx.fillRect(currentX, 10, 3, 300);

        drawStickFigure(currentX + 20, 300);

        ctx.beginPath();
        ctx.moveTo(lineX, 10);
        ctx.lineTo(bottomX, 310);
        ctx.strokeStyle = rope;
        ctx.stroke();

        t++;

        if (t <= duration) {
            requestAnimationFrame(animateLineMove);
        } else {
            resetMovingLine();
        }
    }

    animateLineMove();
}

// Função para redesenhar a linha móvel
function resetMovingLine() {
    bottomX = lineX;  

    // Redesenha a linha móvel
    ctx.beginPath();
    ctx.moveTo(lineX, 120);
    ctx.lineTo(bottomX, 320);
    ctx.strokeStyle = rope;
    ctx.stroke();
}

document.addEventListener('keydown', control);

function control(e){
    if(e.key === 'ArrowRight'){
        if(bottomX > 200){
            score += 10;
            $('#score').text(score);
            if(!localStorage.getItem("max-score-templeEscape") || localStorage.getItem("max-score-templeEscape") < score){
                localStorage.setItem("max-score-templeEscape", score);
            }

            if(score > 80){
                speed = 10;
                level = 5;
            } else if(score > 60){
                speed = 7;
                level = 4;
            } else if(score > 40){
                speed = 5;
                level = 3;
            } else if(score > 20){
                speed = 2;
                level = 2;
            } else {
                speed = 1;
                level = 1;
            }

            $('#level').text(level);

            drawMove()

        } else {
            defeat = true;
            drawDefeat();
        }
    }
}

$('.btn-play').click(function(){
    location.reload()
})
