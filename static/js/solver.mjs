const sudokuTable = document.getElementById('sudoku-table')
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
    console.log("len", state.length)
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
    
    if (!canEditCell(elem)) {
        return
    }
    
    if (!elem.classList.contains('cell')) {
        return
    }
    if (e.key.toLowerCase() == 'backspace') {
        elem.innerText = null;
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
    const response = await makeCheckValidRequest(tableState, index, number)
    if (!response.is_valid) {
        elem.classList.add('error')
    }
    
}

sudokuTable.addEventListener('click', clickCellHandler)
sudokuTable.addEventListener('keydown', keyCellHandler)

const clearButton = document.getElementById('clear-button')
clearButton.addEventListener('click', function(e) {
    cells.forEach(cell => cell.innerText = null)
})

