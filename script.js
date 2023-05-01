let score = 0;
let answer;
let difficultyLevel = 0;
let time;
let timerInterval;

const buttons = document.querySelectorAll('#answer-buttons button');
const buttonDisplay = document.querySelector('#answer-buttons');
const questionDisplay = document.querySelector('#question');
const timer = document.createElement('span');
timer.classList.add('timer');
timer.innerText = '02:00';
document.body.appendChild(timer);

for(let i = 0; i<buttons.length; i++){
    buttons[i].addEventListener('click', checkAnswer)
}

questionDisplay.style.display = 'none';
buttonDisplay.style.display = 'none';

const startButton = document.createElement('button');
startButton.classList.add('start-button');
startButton.innerText = 'Start';
document.body.appendChild(startButton);

const countDownContainer = document.createElement('div');
countDownContainer.classList.add('countdown-container');
document.body.appendChild(countDownContainer);
let countDown = document.createElement('p');
countDownContainer.appendChild(countDown);
countDownContainer.style.display = 'none';


let gameOver = document.createElement('p');
document.body.appendChild(gameOver);
gameOver.style.display = 'none';


startButton.addEventListener('click', () => {
    setTimeout(start, 100);
});

function start() {
    gameOver.style.display = 'none';
    time = 119;
    timer.innerText = '02:00';
    countDown.innerText = '';
    countDownContainer.style.display = '';
    countDown.innerText = '3';
    startButton.style.display = 'none';
    countDown.classList.add('move-on');
    setTimeout(() => {
        countDown.classList.remove('move-on');
        countDown.classList.add('move-off');
    }, 700);
    setTimeout(() => {
        countDown.innerText = '';
        countDown.classList.remove('move-off');
        countDown.innerText = '2';
        countDown.classList.add('move-on');
    }, 1000);
    setTimeout(() => {
        countDown.classList.remove('move-on');
    },1300);
    setTimeout(() => {
        countDown.classList.add('move-off');
    }, 1700);
    setTimeout(() => {
        countDown.innerText = '';
        countDown.classList.remove('move-off');
        countDown.innerText = '1';
        countDown.classList.add('move-on');
    }, 2000);
    setTimeout(() => {
        countDown.classList.remove('move-on');
    }, 2300);
    setTimeout(() => {
        countDown.classList.add('move-off');
    }, 2700);
    setTimeout(() => {
        countDownContainer.style.display = 'none';
        questionDisplay.textContent = newQuestion();
        setAnswerButtons();
        questionDisplay.style.display = '';
        buttonDisplay.style.display = '';
        countDown.classList.remove('move-off');
        timer.innerText = '01:59';
        timerInterval = setInterval(decreaseTimer, 1000);
    }, 3000);
    setTimeout(() => {
        clearInterval(timerInterval);
        timer.innerText = '00:00';
        gameOver.classList.add('game-over');
        gameOver.innerText = 'Final score: ' + score;
        questionDisplay.style.display = 'none';
        buttonDisplay.style.display = 'none';
        gameOver.style.display = '';
        startButton.innerText = 'Play again';
        startButton.style.display = '';
    }, 3000 + time*1000);
    
}

function decreaseTimer() {
    time--;
    let minutes = Math.floor(time/60).toString().padStart(2,'0');
    let seconds = (time % 60).toString().padStart(2,'0');
    timer.innerText = minutes + ':' + seconds;
}





function checkAnswer() {
    if(time > 0 && this.innerText == answer.toString()){
        score++;
    } else {
        score--;
    }
    questionDisplay.textContent = newQuestion();
    setAnswerButtons();
}

function setAnswerButtons() {
    for(let i = 0; i<buttons.length; i++) { //clear the content of the buttons
        if(buttons[i].innerText != ''){
            buttons[i].innerText = '';
        }
    }
    let correctButtonIndex = Math.floor(Math.random()*4);
    buttons[correctButtonIndex].innerText = answer;
    
    if(answer == '-' || answer == '+' || answer == 'x' || answer == '\u00F7'){
        let symbols = ['+','-','x','\u00F7'];
        symbols = symbols.filter(symbol => symbol != answer)
        for(let i = 0; i<buttons.length; i++) {
            if(i == correctButtonIndex){
                continue;
            }
            buttons[i].innerText = symbols.pop();
        }

    } else {
        let wrongAnswers = [];
        for(let i = 0; i<3; i++){
            let newWrong;
            do {
                newWrong = Math.floor(Math.random()) >= 0.5 ? parseInt(answer) + (Math.floor(Math.random()*10)+1) : parseInt(answer) - (Math.floor(Math.random()*10)+1);
            } while(wrongAnswers.includes(newWrong));
            wrongAnswers.push(newWrong);
        }

        for(let i = 0; i<buttons.length; i++){
            if(i == correctButtonIndex){
                continue;
            }
            buttons[i].innerText = wrongAnswers.pop().toString(); //come back to this very unsophisticated way to decide other answers
        }
    }
}


function newQuestion(){
    const total = Math.floor(Math.random()*60);
    const  leftSide = makeExpression(total, 2); //at least two operands on the left hand side
    const rightSide = makeExpression(total, 1); //at least 1 operands on the right hand side
    const completeExpression = leftSide + ' = ' + rightSide;
    let elements = completeExpression.split(' ');
    let elementToHideIndex;
    do {
        elementToHideIndex = Math.floor(Math.random()*elements.length);
    } while(elements[elementToHideIndex] == '=');
    answer = elements[elementToHideIndex];
    elements[elementToHideIndex] = '?';
    equationWithHiddenElement = elements.join(' ');
    return equationWithHiddenElement;
}

function makeExpression(total, minOperands) {
    numOfOperands = minOperands + Math.floor(Math.random()*(4-minOperands)); //number of operands must be between minOperands and 3
    let operands = [];
    let operators = [];
    switch(numOfOperands) {
        case 1:
            return total.toString();
        case 2:
            if(total<=15) {
                operators[0] = randomOperator(4);
                if(total==1 && operators[0]=='x'){
                  let random = Math.floor(Math.random()*3);
                  switch(random) {
                    case 0:
                        operators[0] = '+';
                        break;
                    case 1:
                        operators[0] = '-';
                        break;
                    case 2:
                        operators[0] = '\u00F7';
                  }  
                }
                decide2Operands();
            } else {
                operators[0] = randomOperator(3); //no division operator, to prevent large division calculations
                decide2Operands(); //division operator won't be generated so calling this method is okay
            }
            return operands[0] + ' ' + operators[0] + ' ' + operands[1];
        case 3:
           operators[0] = randomOperator(4); 
           operators[1] = randomOperator(4);
           
           
           switch(operators[0].toString() + operators[1].toString()){
            case '++':
                operands[0] = Math.floor(Math.random()*(total))+(Math.floor(Math.random()*10)); //Plus random number is to give the other operands a chance of being negative
                operands[1] = Math.floor(Math.random()*(total-operands[0]))+1; // +1 to avoid 0
                while((operands[0]+operands[1])==total){ //to make sure that operands[2] will not become 0
                    operands[1] = Math.floor(Math.random()*(total-operands[0]))+1;
                }
                operands[2] = total-operands[1]-operands[0];
                break;
            case '+-':
                operands[0] = Math.floor(Math.random()*113)+1; //+1 to avoid 0
                operands[1] = Math.floor(Math.random()*113)+1;
                while((operands[0]+operands[1]-total)==0){ //to make sure that operands[2] will not become 0
                    operands[1] = Math.floor(Math.random()*113)+1;
                }
                operands[2] = operands[0] + operands[1] - total;
                break;
            case '+x':
                do {
                    operands[0] = Math.floor(Math.random()*101)+1; //Preventing any expressions that begin with '0 + '
                } while(operands[0]==total);
                if(total == 0) {
                    operands[1] = Math.floor(Math.random()*101);
                    if(operands[1] == 0){
                        operands[2] = Math.floor(Math.random()*101);
                    } else {
                        operands[2] = 0;
                    }
                } else {
                    let factors = getFactors(total-operands[0]);
                    operands[1] = factors[Math.floor(Math.random()*factors.length)-1]; //the minus 1 is to make sure that this part of the question will never say ' x 1'
                    operands[2] = (total-operands[0])/operands[1];
                }
                break;
            case '+' + '\u00F7':
                if(total==0){
                    operands[2] = Math.floor(Math.random()*14) +2; //+2 to avoid divide by 1
                    operands[1] = operands[2] * (Math.floor(Math.random()*15)+1);
                    operands[0] = (operands[1]/operands[2]) *-1;
                } else {
                    operands[2] = Math.floor(Math.random()*14) +2;
                    do {
                        operands[1] = operands[2] * (Math.floor(Math.random()*15)+1);
                    } while ((total - (operands[1]/operands[2]))==0); //to prevent expression starting with '0 + '
                    
                    operands[0] = total - (operands[1]/operands[2]);
                }
                break;
            case '--':
                operands[0] = Math.floor(Math.random()*151) - 50;
                do {
                    operands[1] = Math.floor(Math.random()*151) - 50;
                } while(operands[1] == 0 || ((operands[0] - operands[1]) - total)==0); // to prevent subtracting 0
                operands[2] = (operands[0] - operands[1]) - total;
                break;
            case '-+':
                operands[0] = Math.floor(Math.random()*151) -25;
                do {
                    operands[1] = Math.floor(Math.random()*151) -25;
                } while(operands[1]==0 || (total - (operands[0] - operands[1]))==0); 
                operands[2] = total - (operands[0] - operands[1]);
                break;
            case '-x':
                operands[1] = Math.floor(Math.random()*15)+1;
                let multiplierForRandom = 100/operands[1] <= 14 ? Math.floor(100/operands[1]) : 14; //to make sure operands[0] isn't going to end up huge
                operands[2] = Math.floor(Math.random()*(multiplierForRandom-2))+2; //product of operands[1] and operands[2] must not be 0 or 1 or else in hidden symbol questions, you wouldn't be able to tell if operators[0] is - or +
                operands[0] = total + operands[1]*operands[2];
                break;
            case '-' + '\u00F7':
                operands[2] = Math.floor(Math.random()*14)+2;
                operands[1] = operands[2]*(Math.floor(Math.random()*15)+1);
                operands[0] = total + operands[1]/operands[2];
                break;
            case 'x-':
                operands[0] = Math.floor(Math.random()*16);
                do {
                    operands[1] = Math.floor(Math.random()*14)+2; //don't want x 0 or x 1
                } while ((operands[0]*operands[1]-total) == 0);
                operands[2] = operands[0]*operands[1]-total;
                break;
            case 'x+':
                operands[0] = Math.floor(Math.random()*16);
                do {
                    operands[1] = Math.floor(Math.random()*14)+2;
                }while((total - operands[0]*operands[1])==0)
                
                operands[2] = total - operands[0]*operands[1];
                break;
            case 'xx':
                if(total==0){
                    operands[0] = Math.floor(Math.random()*16);
                    operands[1] = Math.floor(Math.random()*14)+2;
                    operands[2] = Math.floor(Math.random()*14)+2;
                    if(operands[0] != 0){
                        let randOp = Math.floor(Math.random()*3);
                        operands[randOp] = 0; 
                        } 
                }else {
                    let factors = getFactors(total);
                    if(factors.length==2) { //factors.length==2 means it's a prime number
                        return makeExpression(total, minOperands) //a prime number made of two multiplications is going to involve ' x 1'
                    }
                    operands[2] = factors[Math.floor(Math.random()*(factors.length-2))+1]; //don't use 1 or the total
                    let productOf0and1 = total/operands[2];
                    factors = getFactors(productOf0and1);
                    operands[1] = factors[Math.floor(Math.random()*(factors.length-1))+1]; //don't use 1, but total is okay
                    operands[0] = productOf0and1/operands[1];
                }
                break;
            case 'x' + '\u00F7':
                if(total==0){
                    operands[2] = Math.floor(Math.random()*14)+2; //+2 to avoid divide by 1
                    operands[1] = operands[2]*(Math.floor(Math.random()*15)+1);
                    operands[0] = 0;
                } else {
                    if(total<=15){
                        operands[2] = Math.floor(Math.random()*14)+2;
                    } else if (total<=45) {
                        operands[2] = Math.floor(Math.random()*4)+2;
                    } else {
                        operands[2] = Math.floor(Math.random()*2)+2;
                    }
                    
                    let productOf0and1 = total*operands[2];
                    let factors = getFactors(productOf0and1);
                    operands[1] = factors[Math.floor(Math.random()*(factors.length-1))+1]; //not letting this operand be 1
                    operands[0] = productOf0and1/operands[1];
                }
                break;
            case '\u00F7' + '-':
                operands[1] = Math.floor(Math.random()*14)+2;
                operands[0] = operands[1] * (Math.floor(Math.random()*15)+1);
                while((operands[0]/operands[1]-total)==0) { //operands[2] must not be 0
                    operands[0] = operands[1] * (Math.floor(Math.random()*15)+1);
                }
                operands[2] = operands[0]/operands[1] - total;
                break;
            case '\u00F7' + '+':
                operands[1] = Math.floor(Math.random()*14)+2; //+2 to avoid divide by 1
                operands[0] = operands[1] * (Math.floor(Math.random()*15)+1);
                while((total - operands[0]/operands[1])==0) { //loop to avoid '+ 0'
                    operands[0] = operands[1] * (Math.floor(Math.random()*15)+1);
                }
                operands[2] = total - operands[0]/operands[1];
                break;
            case '\u00F7' + 'x':
                if(total==0){
                    operands[1] = Math.floor(Math.random()*14)+2;
                    operands[0] = operands[1]*(Math.floor(Math.random()*15)+1);
                    operands[2] = 0;
                } else if(total==1) { //if total is 1 you can't avoid multiplication or division by 1
                    return makeExpression(total, minOperands);
                } else {
                    let factors = getFactors(total);
                    operands[2] = factors[Math.floor(Math.random()*(factors.length-1))+1]; //must not be 1
                    let resultOfDivision = total/operands[2];
                    operands[0] = resultOfDivision * (Math.floor(Math.random()*5)+2); //only want a small number here or else operands[0] risks being huge. Also it must not be 1
                    operands[1] = operands[0]/resultOfDivision;
                }
                break;
            case '\u00F7' + '\u00F7':
                if (total==0 || total>15){ //recursive call to this function because I don't want to make 0 or a large number out of 2 divisions
                    return makeExpression(total, minOperands);
                } else if (total<=15) {
                    let multiplierForRandom = 112.5/total <= 14 ? Math.floor(112.5/total) : 14; 
                    operands[2] = Math.floor(Math.random()*multiplierForRandom)+2; //must not be 1. Product of operands[2] * total must be less than 112.5 or else operands[1] would have to be 1
                    multiplierForRandom = 112.5/(total*operands[2]) <= 14 ? Math.floor(112.5/(total*operands[2])) : 14;
                    operands[1] = Math.floor(Math.random()*multiplierForRandom)+2; 
                    operands[0] = operands[1]*operands[2]*total;
                }
                break;
            } //end of inner switch
           return operands[0] + ' ' + operators[0] + ' ' + operands[1] + ' ' + operators[1] + ' ' + operands[2];
        } // end of outer switch

        function decide2Operands() {
            switch(operators[0]){
                case '+':
                    operands[0] = Math.floor(Math.random()*(total+1));
                    while((total -operands[0]) ==0) { //operands[1] must not be 0
                        operands[0] = Math.floor(Math.random()*(total+1));
                    }
                    operands[1] = total - operands[0];

                    break;
                case '-':
                    operands[1] = Math.floor(Math.random()*100)+1; //+1 to make sure you're never subtracting 0
                    operands[0] = total + operands[1];
                    break;
                case 'x':
                    if(total==0){
                        operands[0] = Math.floor(Math.random()*16);
                        if(operands[0]==0){
                            operands[1] = Math.floor(Math.random()*16);
                        } else {
                            operands[1] = 0;
                        }
                    } else {
                        let factors = getFactors(total);
                        console.log(factors);
                        operands[0] = factors[Math.floor(Math.random()*(factors.length-1))]; //this must not be the total or else operands[1] would become 1
                        console.log(operands[0]);
                        operands[1] = total/operands[0];
                    }
                    break;
                case '\u00F7':
                    operands[1] = Math.floor(Math.random()*14) + 2; //range of 2 to 15, to avoid division by 0, division by 1 or large division calculations
                    operands[0] = total * operands[1];
                    break;
            }
        }

        function getFactors(num){
            if(num==0) {
                console.log('0 passed to getFactors method');
                return [];
            }
            let factors = [];
            let posNum;
            if(num>0){
                posNum = num;
            } else {
                posNum = -num; //can only factorialize positive numbers
            }
            for(let i = 1; i<=Math.sqrt(posNum); i++) {
                if(posNum % i == 0){
                    if(num>0) {
                        factors.push(i);
                    } else {
                        factors.push(-i);
                    }
                    
                    if(!(i == Math.sqrt(posNum))){
                        if(num>0) {
                            factors.push(posNum/i);
                        } else {
                            factors.push(-(posNum/i));
                        }
                    }
                }
            }
            factors.sort((a,b) => {
                return a - b;
            })
            return factors;
        }
        
        function randomOperator(bound) {
            let picker = Math.floor(Math.random()*bound);
            switch(picker){
                case 0:
                        return '+';
                    case 1:
                        return '-';
                    case 2:
                        return 'x';
                    case 3:
                        return '\u00F7';
                    default:
                        return '0';
            }
        }
}

