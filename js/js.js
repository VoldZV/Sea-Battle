'use strict'

const startGameButton = document.querySelector('.button'),
      userGameField = document.querySelector('.userGameField'),
      computerGameField = document.querySelector('.computerGameField'),
    //   sheeps = [ [1,4], [2,3], [3,2], [4,1] ],  // РАБОТАЕТ НЕ ВСЕГДА ТАК КАК ЕСТЬ СИТУАЦИИ, КОГДА 4-Х ПАЛУБНИКУ ПРОСТО НЕ ХВАТИТ МЕСТА (в таком случае программа просто зацикливается)
      sheeps = [ [4,1], [3,2], [2,3], [1,4] ],
      indexs = []; // массив для выстрелов компьютера

let startGame = false,
    computerSheeps,
    userSheeps,
    userHits = 0,
    computerHits = 0;
    
for (let v=0; v<100; v++) {
    indexs[v] = v;
};

generateGameField();

startGameButton.addEventListener('click', function(event) {
    generateSheeps(userGameField);
    generateSheeps(computerGameField);
}, {'once':true});


computerGameField.addEventListener('click', function (event) {
    let isUserMove = true;
    
    if(startGame && (event.target.closest('.hit') || event.target.closest('.miss')) ) {
        console.log('СЮДА УЖЕ СТРЕЛЯЛИ!!!');
    } else if(startGame && event.target.closest('.sheep')) {
        event.target.classList.add('hit');
        event.target.classList.toggle('sheep');
        userHits++;
        console.log(`Попадание. Всего попаданий ${userHits}`);
    } else if(startGame && event.target.closest('.rowCell')){
        event.target.classList.add('miss');
        isUserMove = false;
    }
    
    if(!isUserMove) {
        //запуск хода компьютера для выстрела
        console.log('ПРОМАХ');
        setTimeout(computerMove, 500);
    }
});


function generateGameField () {
    for (let i=0; i < 10; i++) {
        const rowElement = document.createElement('div');
        rowElement.classList.add('row');
        userGameField.appendChild(rowElement);

        for(let j=0; j<10; j++) {
            const cellElement = document.createElement('div');
            cellElement.classList.add('rowCell');
            document.querySelectorAll('.row')[i].appendChild(cellElement);
        }
    }
    computerGameField.innerHTML = userGameField.innerHTML;
    startGame = true;
}

function computerMove() {
    let isComputerMove = true;
    userSheeps = userGameField.querySelectorAll('.rowCell');
    let index;
    
    while(isComputerMove) {
        let indexsRemove = Math.floor(Math.random()*indexs.length);
        index = indexs[indexsRemove];
        console.log(indexsRemove);
        console.log(index);
        if(userSheeps[index].closest('.sheep')) {
            userSheeps[index].classList.add('hit');
            userSheeps[index].classList.toggle('sheep');
            indexs.splice(indexsRemove,1);
            computerHits++;
            console.log(`Попадание компьютера. Всего попаданий ${computerHits}`);
        } else if (userSheeps[index].closest('.rowCell')) {
            userSheeps[index].classList.add('miss');
            console.log(`Промах компьютера`);
            indexs.splice(indexsRemove,1); 
            isComputerMove = false;
        };
    };
};

function generateSheeps (gameField) {    // расположить корабли случайным образом
    sheeps.forEach(function(sheepType,i) {
        let isVertical, // 1 - sheep vertical, 0 - sheep horizontal
            line, // choise number of horizontal line
            cell, // choise number of vertical line
            isRight, // direction of generate deck (1 - right or up, 0 - left or down)
            reverse, // количество изменений направления генерации корабля
            sheep;
        nextSheep: 
        for (let numSheep = 0; numSheep < sheepType[1]; numSheep++) {
                    isVertical = !!Math.floor(Math.random()*2),
                    line = Math.floor(Math.random()*10),
                    cell = Math.floor(Math.random()*10), 
                    isRight = Math.floor(Math.random()*2),
                    reverse = 0,
                    sheep = [];
                    console.log('sheep', sheep);
                    console.log('isVertical', isVertical, 'LINE CELL', line, cell);
                    
                    nextDeck:    
                    for(let deck = 1; deck <= sheepType[0]; deck++) {
                            console.log(deck);
                            if (reverse == 2 && deck == 2) {
                                console.log('REVERSE 2 *********** а вертикальность', isVertical);
                                isVertical = !isVertical;
                                console.log('а теперь вертикальность', isVertical)
                            } else if (reverse == 4 || (!canIstart() && deck == 1) || (reverse == 2 && (deck == 3 || deck == 4))) { // если первую палубу не поставить и учет случаев при изменении направления генерации корабля, при которых невозможна дальнейшая установка корабля 
                                console.log(`*****Невозможно установить корабль ТИПа ${sheepType[0]}`, 'REVERSE', reverse, 'DECK', deck);
                                numSheep--;  
                                continue nextSheep;
                            };
                            
                            if (deck <= sheepType[0] && sheepType[0] != 1) { // если у корабля больше одной палубы и устанавливается не первая палуба
                                generateDeck ();
                            } else if (deck == 1) { // если устанавливается первая палуба
                                sheep.push([line,cell]);
                            };

                            if(deck == sheepType[0]) { // когда все палубы установлены
                                if (sheep.length > 1) {
                                    sheep.sort((a,b) => {
                                        if(isVertical) {
                                            return a[0] - b[0];
                                        } else {
                                            return a[1] - b[1];
                                        };
                                    });
                                };
                                addClassSheep();
                                continue nextSheep;
                            };

                            function canIstart () { // проверка возможности установки первой палубы
                                newline: for (let itrX = line - 1; itrX <= line + 1; itrX++) {
                                    if(itrX < 0) {continue newline};
                                    if(itrX > 9) {return true};
                                    newcell: for (let itrY = cell - 1; itrY <= cell + 1; itrY++) {
                                        if (itrY < 0) {continue newcell};
                                        if (itrY > 9) {continue newline};
                                        if (gameField.children[itrX].children[itrY].closest('.sheep')) {
                                            return false;
                                        }   else if (itrX == line + 1 && itrY == cell + 1) {    
                                            return true;
                                        };
                                    };
                                };
                            };
        
                            function generateDeck () {
                                let proceed = 1;
                                if(isVertical) {
                                    console.log('Vertical sheep')

                                    if(isRight && proceed) {
                                        
                                        line++; // идем вверх к следующей линии и проверяем можно ли идти
                                      
                                        if(line > 9 || gameField.children[line].children[cell].closest('.cannotSheep'))  {
                                            isRight = 0;
                                            reverse++;
                                            line-=(deck-1); // возврат к изначальной ячейке с сохранением удачных ячеек                                       
                                            deck--;
                                            proceed = !proceed;
                                        } else if (!gameField.children[line].children[cell].closest('.cannotSheep')) {
                                            sheep.push([line,cell]);
                                        };
                                    };
        
                                    if(!isRight && proceed) {
                                        
                                        line--; // идем вниз к следующей линии и проверяем можно ли идти
                                        
                                        if(line < 0 || gameField.children[line].children[cell].closest('.cannotSheep'))  {
                                            isRight = 1;
                                            reverse++;
                                            line+=(deck-1); // возврат к изначальной ячейке с сохранением удачных ячеек                                       
                                            deck--; 
                                            proceed = !proceed;
                                        } else if (!gameField.children[line].children[cell].closest('.cannotSheep')) {
                                            sheep.push([line,cell]);
                                        };
                                    };
                                };
        
                                if(!isVertical && proceed) {
                                    console.log('Horizontal sheep');
        
                                    if(isRight) {
                                        
                                        cell++; // идем вправо по линии и проверяем можно ли идти
                                       
                                        if(cell > 9 || gameField.children[line].children[cell].closest('.cannotSheep'))  {
                                            isRight = 0;
                                            reverse++;
                                            cell-=(deck-1); // возврат к изначальной ячейке с сохранением удачных ячеек                                       
                                            deck--;
                                            proceed = !proceed;
                                        } else if (!gameField.children[line].children[cell].closest('.cannotSheep')) {
                                            sheep.push([line,cell]);
                                        }
                                    };
        
                                    if(!isRight && proceed) {

                                        cell--; // идем влево по линии и проверяем можно ли идти

                                        if(cell < 0 || gameField.children[line].children[cell].closest('.cannotSheep'))  {
                                            isRight = 1;
                                            reverse++;
                                            cell+=(deck-1); // возврат к изначальной ячейке с сохранением удачных ячеек                                       
                                            deck--;
                                            proceed = !proceed;
                                        } else if (!gameField.children[line].children[cell].closest('.cannotSheep')) {
                                            sheep.push([line,cell]);
                                        };
                                    };
                                };
                            };

                            function addClassSheep () { // добавление классов ячейкам, на которых сгенерирован корабль и вокруг корабля
                                sheep.forEach(function() { 
                                    let x = sheep[0][0];
                                    let y = sheep[0][1];
                                    
                                    if (!isVertical) {
                                        lineX: for(let itrX = x - 1; itrX <= x + 1; itrX++) {
                                            if(itrX < 0 || itrX > 9) {
                                                continue lineX;
                                            };
                                            cellY: for(let itrY = y-1; itrY <= y + sheep.length; itrY++) {
                                                if(itrY < 0 || itrY > 9) {
                                                    continue cellY;
                                                };
                                                if(itrX == x  &&  itrY >= y && itrY < y + sheep.length)  {
                                                    gameField.children[itrX].children[itrY].classList.add('sheep',`sheepType${sheepType[0]}`);
                                                } else {
                                                    gameField.children[itrX].children[itrY].classList.add('cannotSheep');
                                                };
                                            };
                                        };
                                    };
                                    
                                    if (isVertical) {
                                        lineVX: for(let itrX = x - 1; itrX <= x + sheep.length; itrX++) {
                                            if(itrX < 0 || itrX > 9) {
                                                continue lineVX
                                            };
                                            cellVY: for(let itrY = y - 1; itrY <= y + 1; itrY++) {
                                                if(itrY < 0 || itrY > 9) {
                                                    continue cellVY;
                                                };
                                                if(itrY == y && itrX >= x  && itrX < x + sheep.length)  {
                                                    gameField.children[itrX].children[itrY].classList.add('sheep',`sheepType${sheepType[0]}`);
                                                } else {
                                                    gameField.children[itrX].children[itrY].classList.add('cannotSheep');
                                                };
                                            };
                                        };
                                    };
                                });
                            };
                        };
                };
    });
};


