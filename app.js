document.addEventListener('DOMContentLoaded', ()=>{
  const grids = document.querySelector('.grid');
  let squares = Array.from(document.querySelectorAll('.grid div'));
  const scoreDisplay = document.querySelector('#score');
  const startBtn = document.querySelector('#start-button');
let nextRandom = 0;
let timerId ;
  const width = 10;
let score = 0;

const colors = [
  'orange',
  'blue',
  'green',
  'purple',
  'red'
]
//The Tetrominoes
const lTetromino = [
  [1, width+1, width*2+1, 2],
  [width, width+1, width+2, width*2+2],
  [1, width+1, width*2+1, width*2],
  [width, width*2, width*2+1, width*2+2]
]

const zTetromino = [
  [0,width,width+1,width*2+1],
  [width+1, width+2,width*2,width*2+1],
  [0,width,width+1,width*2+1],
  [width+1, width+2,width*2,width*2+1]
]

const tTetromino = [
  [1,width,width+1,width+2],
  [1,width+1,width+2,width*2+1],
  [width,width+1,width+2,width*2+1],
  [1,width,width+1,width*2+1]
]

const oTetromino = [
  [0,1,width,width+1],
  [0,1,width,width+1],
  [0,1,width,width+1],
  [0,1,width,width+1]
]

const iTetromino = [
  [1,width+1,width*2+1,width*3+1],
  [width,width+1,width+2,width+3],
  [1,width+1,width*2+1,width*3+1],
  [width,width+1,width+2,width+3]
]


  const Tetriminos = [lTetromino , zTetromino , tTetromino , oTetromino, iTetromino];
  let currentPos = 4;
  let currentRotation = 0;


  let random = Math.floor(Math.random()*Tetriminos.length);
  let current =Tetriminos[random][currentRotation];

  function draw() {
    current.forEach(index => {
      squares[currentPos + index].classList.add('tetromino');
      squares[currentPos + index].style.backgroundColor = colors[random];
    })
  }
  function undraw() {
    current.forEach(index => {
      squares[currentPos + index].classList.remove('tetromino')
      squares[currentPos + index].style.backgroundColor = '';
    })
  }

  function control(e){
    if(e.keyCode === 37){
      moveLeft();
    } else if(e.keyCode === 38){
      rotate();
    }
    else if(e.keyCode === 39){
      moveRight();
    }
    else {
      moveDown();
    }
  }

  document.addEventListener('keyup',control);



  function moveDown(){
    undraw();
    currentPos += width;
    draw();
    freeze();

  }


  function freeze(){
    if(current.some(index => squares[currentPos + index + width].classList.contains('taken'))) {
      current.forEach(index => squares[currentPos + index].classList.add('taken'))
      //start a new tetromino falling
      random = nextRandom
      nextRandom = Math.floor(Math.random() * Tetriminos.length)
      current = Tetriminos[random][currentRotation]
      currentPos = 4
      draw()
      displayShapes()
      addScore()
      gameOver()
    }

  }

  function moveLeft(){
    undraw();

    const isLeftEdge = current.some(index=> (currentPos + index) % width === 0)
    console.log(isLeftEdge);
    console.log("before",currentPos)
    if(!isLeftEdge){
      currentPos -=1;
    }
    console.log('after',currentPos)
    if(current.some(index =>squares[currentPos + index].classList.contains('taken'))) {
      currentPos += 1;
    }
    draw();
  }

  function moveRight(){
    undraw();

    const isRigtEdge = current.some(index=> (currentPos + index) % width === width - 1)

    if(!isRigtEdge){
      currentPos += 1;
    }
    if(current.some(index =>squares[currentPos + index].classList.contains('taken'))) {
      currentPos -= 1;
    }
    draw();
  }

  function rotate(){
    undraw();
    currentRotation ++;
    if(currentRotation === current.length){
      currentRotation = 0;
    }
    current = Tetriminos[random][currentRotation]

    draw();

  }


//handle mini grids

let displaySquares = document.querySelectorAll('.mini-grid div');
let displayWidth = 4;
let displayIndex = 0;

const upNextTetrominoes = [
   [1, displayWidth+1, displayWidth*2+1, 2], //lTetromino
   [0, displayWidth, displayWidth+1, displayWidth*2+1], //zTetromino
   [1, displayWidth, displayWidth+1, displayWidth+2], //tTetromino
   [0, 1, displayWidth, displayWidth+1], //oTetromino
   [1, displayWidth+1, displayWidth*2+1, displayWidth*3+1] //iTetromino
 ]

 function displayShapes(){
   displaySquares.forEach(square => {
     square.classList.remove('tetromino')
    square.style.backgroundColor = '';
   })

   upNextTetrominoes[nextRandom].forEach((index) => {
     displaySquares[ displayIndex + index].classList.add('tetromino');
      displaySquares[displayIndex + index].style.backgroundColor = colors[nextRandom];
   });

 }


 startBtn.addEventListener('click', ()=>{
   if(timerId){
     clearInterval(timerId);
     timerId = null;
   }
   else {
     draw();
     timerId = setInterval(moveDown , 1000);
     nextRandom = Math.floor(Math.random()*Tetriminos.length);
     displayShapes();
   }
 })

 function addScore(){
   for(let i = 0; i<199;i++){
     const row = [i,i+1,i+2,i+3,i+4,i+5,i+6,i+7,i+8,i+9];
     if(row.every(index=> squares[index].classList.contains('taken'))){
       score+=10;
       scoreDisplay.innerHTML = score;
       row.forEach((index) => {
         squares[index].classList.remove('tetromino');
         squares[index].classList.remove('taken');
        squares[index].style.backgroundColor = '';

       });

       const squaresRemoved = squares.splice(i , width);
       squares = squaresRemoved.concat(squares);
       squares.forEach((cell) => {
         grids.appendChild(cell);
       });


     }
   }
 }


function gameOver() {
    if(current.some(index => squares[currentPos + index + width].classList.contains('taken'))) {
      scoreDisplay.innerHTML = 'end';
      clearInterval(timerId);
    }
}
})
