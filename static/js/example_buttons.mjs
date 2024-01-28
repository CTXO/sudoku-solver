import {clearButton} from './solver.mjs'
const buttonsContainer = document.getElementById('example-buttons')

const table1 = '...26.7.168..7..9.19...45..82.1...4...46.29...5...3.28..93...74.4..5..367.3.18...'
const table2 = '.2.6.8...58...97......4....37....5..6.......4..8....13....2......98...36...3.6.9.'
const table3 = '.2..........6....3.74.8.........3..2.8..4..1.6..5.........1.78.5....9..........4.'
const examples = {
    1: table1,
    2: table2,
    3: table3
}

const fillExample = function(example) {
    Array.from(example).forEach((value, index) => {
        const valueParsed = parseInt(value)
        if (isNaN(valueParsed)) {
            return
        }

        const row = Math.floor(index / 9)
        const col = index % 9

        const cell = document.querySelector(`.cell[row="${row}"][col="${col}"]`)
        cell.innerText = valueParsed
        cell.classList.add('pre-selected')
    })
}

const exampleButtonHandler = function(e) {
    const elem = e.target
    if (!elem.classList.contains('example-button')) {
        return
    }
    clearButton.click()
    const exampleNumber = parseInt(elem.getAttribute('data-example'))
    const example = examples[exampleNumber]
    fillExample(example)
}


buttonsContainer.addEventListener('click', exampleButtonHandler)

