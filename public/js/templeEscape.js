let canvasEl = document.querySelector('#screen');
let ctx = canvasEl.getContext('2d');

const rope = "#a6491b"
const character = "#ff6b21"

let backgroundImage = new Image();
backgroundImage.src = '/img/backgroundTemple.png'; // Substitua pelo caminho da sua imagem

// Função para desenhar a imagem de fundo e os outros elementos
function drawBackground() {
    // Desenhe a imagem de fundo quando estiver carregada
    backgroundImage.onload = function() {
        // Desenhar a imagem de fundo
        ctx.drawImage(backgroundImage, 0, 0, canvasEl.width, canvasEl.height);

        // Agora você pode desenhar outros elementos no canvas
        drawElements();
    };
}

function drawElements() {
    // Exemplo de desenho de uma linha e um personagem
    ctx.fillStyle = rope;
    ctx.fillRect(450, 120, 3, 200);

    let charX = 100;
    let charY = 300;

    ctx.beginPath();
    ctx.arc(charX, charY, 10, 0, Math.PI * 2, true);
    ctx.strokeStyle = character;
    ctx.stroke();
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

    // Redesenha a linha estática
    ctx.fillStyle = rope;
    ctx.fillRect(450, 120, 3, 200);

    charX = bottomX + 20;

    // Desenha o personagem
    ctx.beginPath();
    ctx.arc(charX, charY, 10, 0, Math.PI * 2, true);
    ctx.strokeStyle = character;
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(lineX, 120);
    ctx.lineTo(bottomX, 320); // Ponto inferior que se move
    ctx.strokeStyle = rope;
    ctx.stroke();

    bottomX += direction * speed;

    // Inverte a direção se atingir os limites
    if (bottomX >= lineX + maxMovement || bottomX <= lineX - maxMovement) {
        direction *= -1;
    }

    if(!defeat){
        requestAnimationFrame(animateLine);
    }
}

animateLine();

// Função que desenha a animação da derrota (queda do personagem)
function drawDefeat(){
    function fall() {
        ctx.clearRect(0, 0, canvasEl.width, canvasEl.height); 

        ctx.fillStyle = rope;
        ctx.fillRect(450, 120, 3, 200);

        ctx.beginPath();
        ctx.moveTo(lineX, 120);
        ctx.lineTo(bottomX, 320);
        ctx.strokeStyle = rope;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(charX, charY, 10, 0, Math.PI * 2, true);
        ctx.strokeStyle = character;
        ctx.stroke();

        charY += fallSpeed;

        if (charY < canvasEl.height - 10) {
            requestAnimationFrame(fall);
        } else {
            alert(`Personagem caiu! Pontuação final: ${score}`);
        }
    }

    fall();
}

function drawMove() {
    let startX = charX;  // Ponto inicial do personagem 
    let startY = charY;  // Ponto inicial do personagem 
    let endX = 450;      // Ponto final 
    let peakY = 120;     // Ponto mais baixo do arco 
    let duration = 100;  // Número de quadros para completar o movimento
    let t = 0;           // Variável de tempo 

    function moveInArc() {
        ctx.clearRect(0, 0, canvasEl.width, canvasEl.height); 

        // Redesenha a linha estática
        ctx.fillStyle = rope;
        ctx.fillRect(450, 120, 3, 200);

        // Redesenha a linha que se move 
        ctx.beginPath();
        ctx.moveTo(lineX, 120);
        ctx.lineTo(bottomX, 320);
        ctx.strokeStyle = rope;
        ctx.stroke();

        let progress = t / duration;  

        charX = startX + progress * (endX - startX);

        charY = startY - (4 * peakY * progress * (1 - progress)); 

        // Desenha o personagem
        ctx.beginPath();
        ctx.arc(charX, charY, 10, 0, Math.PI * 2, true);
        ctx.strokeStyle = character;
        ctx.stroke();

        // Incrementa o tempo e verifica se o movimento deve continuar
        t++;

        if (t <= duration) {
            requestAnimationFrame(moveInArc);
        } 
        else {
            moveStaticLine()
        }
    }

    moveInArc();
}
function moveStaticLine() {
    let startX = 450;      // Posição inicial da linha estática
    let targetX = lineX;    // A posição onde a linha móvel está (inicial)
    let duration = 50;     // Duração da animação
    let t = 0;              // Tempo

    function animateLineMove() {
        ctx.clearRect(0, 0, canvasEl.width, canvasEl.height);

        let progress = t / duration;
        let currentX = startX + progress * (targetX - startX);

        ctx.fillStyle = rope;
        ctx.fillRect(currentX, 120, 3, 200);

        let charProgressX = currentX + 20;
        ctx.beginPath();
        ctx.arc(charProgressX, 300, 10, 0, Math.PI * 2, true);
        ctx.strokeStyle = character;
        ctx.stroke();

        t++;

        if (t <= duration) {
            requestAnimationFrame(animateLineMove);
        } else {
            // Depois que a linha estática se mover completamente, redesenhar a linha
            resetMovingLine();
        }
    }

    animateLineMove();
}

// Função para redesenhar a linha móvel
function resetMovingLine() {
    bottomX = lineX;  // Resetando a posição inicial da linha móvel

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
