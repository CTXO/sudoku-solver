const sudokuTable = document.getElementById('sudoku-table')
const solveButton = document.getElementById('solve-button')
const cells = document.querySelectorAll('.cell')

const replaceByIndex = function(string, index, replacement) {
    if (index >= string.length) {
        return string
    }

    const first_part = string.slice(0, index) 
    const second_part = string.slice(index+1)
    const ret =  first_part + replacement + second_part
    return ret
}

const cellPositionToIndex = function(row, col) {
    return row*9 + col
}

const getTableState = function() {
    let state = ''.padStart(81, '.')
    cells.forEach(function(cell) {
        const cellRow = parseInt(cell.getAttribute('row'))
        const cellCol = parseInt(cell.getAttribute('col'))
        if (isNaN(cellRow) || isNaN(cellCol)) {
            return 
        }
        const index = cellPositionToIndex(cellRow, cellCol)
        const cellContent = cell.innerText
        if (cellContent && !isNaN(cellContent)) {
            let stateTemp = replaceByIndex(state, index, cellContent)
            state = stateTemp
        }
    })
    return state
}

const getDownCell = function(row) {
    if (row == 8) {
        return 0
    }
    return row + 1
}


const getUpCell = function(row) {
    if (row == 0) {
        return 8
    }
    return row - 1
}

const getRightCell = function(col) {
    if (col == 8) {
        return 0
    }
    return col + 1
}


const getLeftCell = function(col) {
    if (col == 0) {
        return 8
    }
    return col - 1
}

const getNextCell = function(row, col) {
    if (row == 8 && col == 8) {
        return [0, 0]
    }
    if (col == 8) {
        return [row+1, 0]
    }
    return [row, col+1]
}

const getPreviousCell = function(row, col) {
    if (row == 0 && col == 0) {
        return [8, 8]
    }
    if (col == 0) {
        return [row-1, 8]
    }
    return [row, col-1]
}


const makeCheckValidRequest = async function(tableState, index, number){
    const checkValidUrl = '/check_valid'
    const options = {
        method: 'POST',
        body: JSON.stringify({
            table_state: tableState,
            index,
            number
        })
    }
    const preResponse = await fetch(checkValidUrl, options)
    const response = await preResponse.json()
    return response
}

const makeSolveTableRequest = async function(tableState){
    const solveTableUrl = '/solve'
    const options = {
        method: 'POST',
        body: JSON.stringify({
            table_state: tableState
        })
    }
    const preResponse = await fetch(solveTableUrl, options)
    const response = await preResponse.json()
    return response

}

const getTableIndexFromPosition = function(row, column) {
    const rowInt = parseInt(row)
    const colInt = parseInt(column)
    return rowInt*9 + colInt
}

const hasInvalidCell = function() {
    const cellsArray = Array.from(cells)
    return cellsArray.some(cell => cell.classList.contains('error'))
}

const canEditCell = function(cell) {
    return !hasInvalidCell() || cell.classList.contains('error')
}


const clickCellHandler = function(e) {
    const elem = e.target
    if (!elem.classList.contains('cell')) {
        return
    }
    
    cells.forEach(cell => cell.classList.remove('selected', 'shadow'))
    elem.classList.add('selected')

    const elemRow = elem.getAttribute('row')
    const elemCol = elem.getAttribute('col')
    const elemBlock = elem.getAttribute('block')
    const shadowElems = document.querySelectorAll(`[row="${elemRow}"], [col="${elemCol}"], [block="${elemBlock}"]`);
    shadowElems.forEach(elem => elem.classList.add('shadow'))
}


const keyCellHandler = async function(e) {
    const elem = e.target

    if (!elem.classList.contains('cell')) {
        return
    }
    if (e.key.toLowerCase() == 'backspace') {
        elem.innerText = null;
        return 
    }

    const row = parseInt(elem.getAttribute('row'))
    const col = parseInt(elem.getAttribute('col'))
    let nextRow = row
    let nextCol = col
    switch(e.key.toLowerCase()) {
        case 'backspace':
            elem.innerText = null;
            break
        case 'arrowleft':
            nextCol = getLeftCell(col)
            break
        case 'arrowright':
            nextCol = getRightCell(col)
            break
        case 'arrowdown':
            nextRow = getDownCell(row)
            break
        case 'arrowup':
            nextRow = getUpCell(row)
            break
        case 'tab':
            e.preventDefault()
            let nextCell
            if (e.shiftKey){
                nextCell = getPreviousCell(row, col)
            }
            else {
                nextCell =  getNextCell(row, col);
            }
            nextRow = nextCell[0]
            nextCol = nextCell[1]
            break
    }

    if (!canEditCell(elem)) {
        return
    }
    if (col !== nextCol || row !== nextRow) {

        const nextCell = document.querySelector(`.cell[row="${nextRow}"][col="${nextCol}"]`)
        nextCell.focus()
        nextCell.click()
        return
    }


    if (isNaN(e.key) || !e.key) {
        return
    }
    elem.innerText = e.key;
    const tableState = getTableState()
    const index = getTableIndexFromPosition(elem.getAttribute('row'), elem.getAttribute('col'))
    const number = parseInt(e.key)
    
    elem.classList.remove('error')
    
    let response;
    try {
        response = await makeCheckValidRequest(tableState, index, number)
    }
    catch(e) {
        console.error(e)
        return 
    }
    if (!response.is_valid) {
        elem.classList.add('error')
    }
    
}


const solveButtonHandler = async function(e) {
    this.classList.add('is-loading')
    this.disabled = true
    
    const response = await makeSolveTableRequest(getTableState())
    if (!response.success) {
        return
    }
    
    const solvedTable = Array.from(response.solved_table)

    for (let [index, number] of solvedTable.entries()) {
        const row = Math.floor(index / 9)
        const col = index % 9 
        const cell = document.querySelector(`.cell[row="${row}"][col="${col}"]`)
        cell.innerText = number
    }

    this.classList.remove('is-loading')
    this.disabled = false
}


sudokuTable.addEventListener('click', clickCellHandler)
sudokuTable.addEventListener('keydown', keyCellHandler)

solveButton.addEventListener('click', solveButtonHandler)

const clearButton = document.getElementById('clear-button')
clearButton.addEventListener('click', function(e) {
    document.activeElement.blur()
    cells.forEach(cell => {
        cell.innerText = null
        cell.classList.remove('selected', 'shadow', 'error')
    })
})

