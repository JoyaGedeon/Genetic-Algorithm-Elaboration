let canvas = document.getElementById('script'); 
let ctx = canvas.getContext("2d");

canvas.width = 360;
canvas.height = 540;

let totalWidth = 540, totalHeight = 360,
    cellSize = 60, 
    numCellWidth = totalWidth / cellSize, 
    numCellHeight = totalHeight / cellSize,  
    grid = [[]], 
    color = 'white'; 

let numbers = []; // array of number 0 -> 4
let drawing = false; // checks if mouse is clicked
let guess = [[]]; // Guess array 

let trial = 1, // counter for a repeated digit 
    digitIndex = 0; // index of array numbers (0 -> 4)

let solutions = []; // Solution array holding the candidate sum
let digitWeight = []; // Solution array holding the ideal sum
let index = 0, //  computed guessed number 
    correctGuess; // correctGuess hold the actual number inputted.

class Grid {
    //constructor 
    constructor(posX, posY, width, height) {
        this.posX = posX;
        this.posY = posY;
        this.width = width;
        this.height = height;
        this.colored = false;
    }
    //draw method
    draw(ctx, color) {
        ctx.beginPath();
        ctx.rect(this.posX, this.posY, this.width, this.height);
        ctx.fillStyle = color;
        ctx.lineWidth = 2;
        ctx.strokeStyle = "black";
        ctx.fill();
        ctx.stroke();
    }
    //fill used to change the color of the rect
    fill(color) {
        this.colored = true;
        this.draw(ctx, color);
    }
}

class Digit{ 
    //Digit class that take the Digit as a 2d matrix
    constructor(){
        this.digits = [[]];
        for(let i = 0; i < numCellWidth; i++){
            this.digits[i] = [numCellWidth]
            for(let j = 0; j < numCellHeight; j++)
                this.digits[i][j] = 0;
        }
    }
}

function getMousePosition(canvas, e) {
    let rect = canvas.getBoundingClientRect();
    let pX = Math.floor(e.clientX - rect.left);
    let pY = Math.floor(e.clientY - rect.top);

    return { 
        //cursor location / cellsize to get position in grid
        y: Math.floor(pX / cellSize),
        x: Math.floor(pY / cellSize)
    };
}

function prepareGrid(){
    for (let i = 0; i < numCellWidth; ++i) {
        grid[i] = [];
        for (let j = 0; j < numCellHeight; ++j) 
            grid[i][j] = new Grid(j * cellSize, i * cellSize, cellSize, cellSize); 
    }
    for (let i = 0; i < numCellWidth; ++i)
        for (let j = 0; j < numCellHeight; ++j) 
            grid[i][j].draw(ctx, color);
}

canvas.addEventListener("mousedown", function(e){
    // if(x > 0 && x <  canvas.width 
    //     && y >= 0 && y < canvas.height)
        drawing = true;
})

canvas.addEventListener("mouseup", function(e){
    // if(x > 0 && x <  canvas.width 
    //     && y >= 0 && y < canvas.height)
        drawing = false;
})

canvas.addEventListener("mousemove", function(e){
    if(drawing){
        start = getMousePosition(canvas, e); // Get start position 
        grid[start.x][start.y].fill('pink'); // Set color
    }
})

// function to input number from 0 to 4 
function inputDigit(){
    if (digitIndex <= 4){
        document.getElementById("displayStep").innerHTML = "Draw '" + digitIndex + "' then press input button";
        prepareDigit(); 
        if(trial != 3)
            trial++;
        else
            if(digitIndex < 4){
                digitIndex++;
                document.getElementById("displayStep").innerHTML = "Draw '" + digitIndex + "' then press input button";
                trial = 1;
            }
            else{ 
                digitIndex++;
                document.getElementById("displayStep").innerHTML = "Draw a number to guess";   
            }
    }
    else  
        guessProcess(); 
    ctx.clearRect(0, 0, 800, 800);
    prepareGrid();
}

function prepareDigit(){
    if(trial == 1 && digitIndex <= 4)
        numbers.push(new Digit());   
    for(let i = 0; i < numCellWidth; i++) 
        for(let j = 0; j < numCellHeight; j++) 
            if(grid[i][j].colored)
                numbers[digitIndex].digits[i][j] += 1;           
            else 
                numbers[digitIndex].digits[i][j] += -1;     
}

function prepareGuess(){
    for(let i = 0; i < numCellWidth; i++){
        guess[i] = [];
        for(let j = 0; j < numCellHeight; j++)
            guess[i][j] = 0;
    }
    for(let i = 0; i < numCellWidth; i++)
        for(let j = 0; j < numCellHeight; j++)
            if(grid[i][j].colored)
                guess[i][j] += 1;
            else 
                guess[i][j] += -1;    
    // console.log("    guess", guess);
}

function clearData(){  
    index = 0;
    guess = [[]];
    error = [];
    solutions = [];
    digitWeight = [];
    document.getElementById("displayStep").innerHTML = "Draw a number to guess";  
    document.getElementById("checkingGuess").innerHTML = "";
}

function guessProcess(){
    document.getElementById("displayStep").innerHTML = "";
    console.log(numbers);
    prepareGuess();
    findSolutions();
    index = calculateParticipation();
    document.getElementById("checkingGuess").innerHTML = "Number is '" + index + "' Guessed Right? ";  
}

function findSolutions(){
    let deltaWeight = 0, newWeight = 0;
    for(let counter = 0; counter < 5; counter++){
        for(let i = 0; i < numCellWidth; i++)
            for(let j = 0; j < numCellHeight; j++){
                deltaWeight += guess[i][j] * numbers[counter].digits[i][j];
                if(numbers[counter].digits[i][j] > 0)
                    newWeight += numbers[counter].digits[i][j];       
            }
        solutions.push(deltaWeight);
        // console.log(counter, "    deltaWeight", deltaWeight);
        digitWeight.push(newWeight);
        // console.log(counter, "    newWeight", newWeight);
        deltaWeight = 0, newWeight = 0;
    }
    // console.log("    Solution", solutions);
    // console.log("    digitWeight", digitWeight);
}
function calculateParticipation(){
    let maximum = [], index = 0, maxValue = 0;
    for(let i = 0; i < 5; i++){
        maximum.push(solutions[i] / digitWeight[i] * 100);
    }

    for(let i = 0; i < 5; i++){
        if(maxValue < maximum[i])
            maxValue = maximum[i];
    }
    // console.log(maximum);
    index = maximum.indexOf(maxValue);
    // console.log(index);
    return index;
}

function guessedRight(){
    guessOutcome(index);
}
function guessedWrong(){
    guessOutcome(correctGuess);
}

function getValueFromCB(){
    correctGuess = document.getElementById("input").value;
}

function guessOutcome(numberIndex){
    for(let i = 0; i < numCellWidth; i++)
        for(let j = 0; j < numCellHeight; j++)
            numbers[numberIndex].digits[i][j] += guess[i][j];
    // console.log("addded to", numberIndex, numbers);
    clearData();
}

prepareGrid();