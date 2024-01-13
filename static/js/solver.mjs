const sudokuTable = document.getElementById('sudoku-table')
const cells = document.querySelectorAll('.cell')
let selectedCell = 

sudokuTable.addEventListener('click', function(e) {
    const elem = e.target
    if (!elem.classList.contains('cell')) {
        return
    }
    cells.forEach(cell => cell.classList.remove('selected'))
    elem.classList.add('selected')
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