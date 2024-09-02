let divs = [];
let score = 0;
const width = 4;
let lastState = [];
let lastScore = 0;

let timer = setInterval(addColours, 50);

$(document).ready(function(){
    createBoard();
    addColours();
    document.addEventListener('keydown', control);
    $('.undo-container').click(undoMove);
    $('.restart-container').click(restart);
});

function restart(){
    divs = [];

    $('.grid').html('');

    score = 0
    $('#score').text(`${score}`);
    
    createBoard();
}

function control(e){
    if(e.key === 'ArrowLeft'){
        keyLeft();
    } else if(e.key === 'ArrowRight'){
        keyRight();
    } else if(e.key === 'ArrowUp'){
        keyUp();
    } else if(e.key === 'ArrowDown'){
        keyDown();
    }
}

function saveState() {
    lastState = divs.map(div => div.innerHTML);
    lastScore = score;
}

function undoMove() {
    if (lastState.length > 0) {
        for (let i = 0; i < divs.length; i++) {
            divs[i].innerHTML = lastState[i];
        }
        score = lastScore;
        $('#score').text(`${score}`);
        addColours();
    }
}

function keyLeft(){
    saveState();
    moveLeft();
    combineRow();
    moveLeft();
    generateNumber();
}

function keyRight(){
    saveState();
    moveRight();
    combineRow();
    moveRight();
    generateNumber();
}

function keyUp(){
    saveState();
    moveUp();
    combineColumn();
    moveUp();
    generateNumber();
}

function keyDown(){
    saveState();
    moveDown();
    combineColumn();
    moveDown();
    generateNumber();
}

function createBoard() {
    for(let i = 0; i < (width * width); i++){
        const div = document.createElement('div');
        $('.grid').append(div);
        div.innerHTML = 0;
        divs.push(div);
    }
    generateNumber();
    generateNumber();
}

function generateNumber(){
    let emptyDivs = divs.filter(div => div.innerHTML == 0);
    if (emptyDivs.length > 0) {
        const randomIndex = Math.floor(Math.random() * emptyDivs.length);
        emptyDivs[randomIndex].innerHTML = 2;
    }
}

function moveRight (){
    for (let i = 0; i < 15; i++){
        if(i % 4 === 0){
            let row = [
                parseInt(divs[i].innerHTML),
                parseInt(divs[i+1].innerHTML),
                parseInt(divs[i+2].innerHTML),
                parseInt(divs[i+3].innerHTML)
            ];
            let filteredRow = row.filter(num => num);
            let missing = 4 - filteredRow.length;
            let zeros = Array(missing).fill(0);
            let newRow = zeros.concat(filteredRow);

            divs[i].innerHTML = newRow[0];
            divs[i+1].innerHTML = newRow[1];
            divs[i+2].innerHTML = newRow[2];
            divs[i+3].innerHTML = newRow[3];
        }
    }
}

function moveLeft (){
    for (let i = 0; i < 16; i++){
        if(i % 4 === 0){
            let row = [
                parseInt(divs[i].innerHTML),
                parseInt(divs[i+1].innerHTML),
                parseInt(divs[i+2].innerHTML),
                parseInt(divs[i+3].innerHTML)
            ];
            let filteredRow = row.filter(num => num);
            let missing = 4 - filteredRow.length;
            let zeros = Array(missing).fill(0);
            let newRow = filteredRow.concat(zeros);

            divs[i].innerHTML = newRow[0];
            divs[i+1].innerHTML = newRow[1];
            divs[i+2].innerHTML = newRow[2];
            divs[i+3].innerHTML = newRow[3];
        }
    }
}

function moveUp() {
    for (let i = 0; i < 4; i++){
        let column = [
            parseInt(divs[i].innerHTML),
            parseInt(divs[i+width].innerHTML),
            parseInt(divs[i+width*2].innerHTML),
            parseInt(divs[i+width*3].innerHTML)
        ];
        let filteredColumn = column.filter(num => num);
        let missing = 4 - filteredColumn.length;
        let zeros = Array(missing).fill(0);
        let newColumn = filteredColumn.concat(zeros);

        divs[i].innerHTML = newColumn[0];
        divs[i+width].innerHTML = newColumn[1];
        divs[i+width*2].innerHTML = newColumn[2];
        divs[i+width*3].innerHTML = newColumn[3];
    }
}

function moveDown() {
    for (let i = 0; i < 4; i++){
        let column = [
            parseInt(divs[i].innerHTML),
            parseInt(divs[i+width].innerHTML),
            parseInt(divs[i+width*2].innerHTML),
            parseInt(divs[i+width*3].innerHTML)
        ];
        let filteredColumn = column.filter(num => num);
        let missing = 4 - filteredColumn.length;
        let zeros = Array(missing).fill(0);
        let newColumn = zeros.concat(filteredColumn);

        divs[i].innerHTML = newColumn[0];
        divs[i+width].innerHTML = newColumn[1];
        divs[i+width*2].innerHTML = newColumn[2];
        divs[i+width*3].innerHTML = newColumn[3];
    }
}

function combineRow() {
    for (let i = 0; i < 15; i++){
        if(divs[i].innerHTML === divs[i + 1].innerHTML){
            let combinedTotal = parseInt(divs[i].innerHTML) + parseInt(divs[i + 1].innerHTML);
            divs[i].innerHTML = combinedTotal;
            divs[i + 1].innerHTML = 0;
            score += combinedTotal;
            $('#score').text(`${score}`);
        }
    }
    checkForWin();
}

function combineColumn() {
    for (let i = 0; i < 12; i++){
        if(divs[i].innerHTML === divs[i + width].innerHTML){
            let combinedTotal = parseInt(divs[i].innerHTML) + parseInt(divs[i + width].innerHTML);
            divs[i].innerHTML = combinedTotal;
            divs[i + width].innerHTML = 0;
            score += combinedTotal;
            $('#score').text(`${score}`);
        }
    }
    checkForWin();
}

function checkForWin(){
    for(let i = 0; i< divs.length; i++){
        if(divs[i].innerHTML == 2048){
            alert('You Win!');
            document.removeEventListener('keydown', control);
            clearInterval(timer);
        }
    }
}

function addColours(){
    for (let i = 0; i < divs.length; i++){
        let value = parseInt(divs[i].innerHTML);
        if (value === 0) {
            divs[i].style.backgroundColor = 'black';
            divs[i].style.color = 'black';
        } else {
            let color = `hsl(${Math.log2(value) * 25}, 50%, 60%)`;
            divs[i].style.backgroundColor = color;
            divs[i].style.color = 'whitesmoke';
        }
    }
}
