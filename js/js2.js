/**
 * Класс конструктор игрового поля
 */
class BaseField {
    constructor() {
        /**
         * Список чисел которые нужно прибавить к индексу чтобы получить клетки вокруг корабля
         * @type {number[]}
         */
        this.AROUND_HORIZONTAL_CELLS = [-11, -10, -9, -1, 0, 1, 9, 10, 11];
        /**
         * Поле c кораблями
         * @type {(undefined | number)[]}
         */
        this.playingField = new Array(100);

        this.generate();
    }

    /**
     * Автоматическая установка кораблей
     */
    generate(){
        for (let i = 0; i <= 0; i++){
            this._createShip(4);
        }
        for (let i = 0; i <= 1; i++){
            this._createShip(3);
        }
        for (let i = 0; i <= 2; i++){
            this._createShip(2);
        }
        for (let i = 0; i <= 3; i++){
            this._createShip(1);
        }
    }

    /**
     * Установка кораблей на поле
     * @param size - размерность корабля
     * @private
     */
    _createShip(size){
        const possiblePlace = this._searchPossiblePlace(size);
        const placeIndex = BaseField._random(possiblePlace.length);

        for(let i = 0; i < size; i++){
            this.playingField[possiblePlace[placeIndex] + i] = size;
        }
    }

    /**
     * Поиск возможных позиций для корабля
     * @param size - размерность корабля
     * @returns {number[]} - массив всех возможных индексов на поле для установки корабля
     * @private
     */
    _searchPossiblePlace(size){
        let possiblePlace = [];
        // lastPoint - последняя точка на поле, которую нужно проверять (например для вертикального 4-палубного корабля последняя точка будет с индексом 6,
        // так как все ячейки справа будут заняты тремя оставшимися палубами
        const lastPoint = 10 - size;
        for (let i = 0; i < 10; i++){
            for (let j = 0; j < lastPoint; j++){
                const index = BaseField._getCurrentIndex(i, j);
                const indexes = [...new Array(size)].map((element, num) => num + index);
                const area = this._getAreaAroundShip(size, indexes);
                const isNotPossible = area.some(element => !!this.playingField[element]);
                if(!isNotPossible){
                    possiblePlace.push(index);
                }
            }
        }
        return possiblePlace;
    }

    /**
     * Конкатенация двумерного перебора для получения индекс в одномерном массиве
     * @param i - ось x
     * @param j - ось y
     * @returns {number} получение результата в виде 1 + 0 = 10
     * @private
     */
    static _getCurrentIndex(i,j){
        return Number(String(i)+String(j));
    }

    /**
     * Получение индексов всех ячеек корабля, а так же в вокруг корабля в области одной ячейки (чтоб корабли не пересекались)
     * @param {number} size - размер корабля
     * @param {number[]} indexes - индекс искомого корабля
     * @private
     */
    _getAreaAroundShip(size, indexes){
        const result = [];
        for (let index of indexes){
            for (let arroundCell of this.AROUND_HORIZONTAL_CELLS){
                const resultCell = arroundCell + index;
                if(!result.includes(resultCell)){
                    result.push(resultCell);
                }
            }
        }
        return result;
    }

    static _random(length){
        return Math.floor(Math.random() * length);
    }
}


/**
 * Управление игрой
 */
class SeaBattle {
    constructor(myFieldSelector, computerFieldSelector){
        this.myGrids = new BaseField();
        this.computerGrids = new BaseField();
        this._render(this.myGrids, myFieldSelector);
        this._render(this.computerGrids, computerFieldSelector);
    }

    _render(Grid, selector){
        const filedClass = document.querySelector(selector);
        for(let index of Grid.playingField){
            const elem = document.createElement('div');
            elem.classList.add('rowCell');
            if(index){
                elem.classList.add('sheep');
            }
            filedClass.appendChild(elem);
        }
    }
}


new SeaBattle('.userGameField', '.computerGameField');





