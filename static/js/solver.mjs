const sudokuTable = document.getElementById('sudoku-table')
const cells = document.querySelectorAll('.cell')

sudokuTable.addEventListener('click', function(e) {
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
})

sudokuTable.addEventListener('keydown', function(e) {
    const elem = e.target
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
})


const clearButton = document.getElementById('clear-button')
clearButton.addEventListener('click', function(e) {
    cells.forEach(cell => cell.innerText = null)
})