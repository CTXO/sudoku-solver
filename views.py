from flask import Blueprint
from flask import render_template
from flask import request

from table import SudokuTable

bp = Blueprint('sudoku', __name__, url_prefix='/')

@bp.route('/')
def index():
    return render_template('index.html')

@bp.route('/solver')
def solver():
    """
    Table structure is a list of blocks.
    Each block is a list of dictionaries representing the block's cells.
    Each dictionary has the 0-indexed row and col position of the cell.
    [
    [{}, {}..., {}],
    [{}, {}..., {}],
    ...
    [{}, {}..., {}]
    ]
    """
    table_structure = [
        [
            {'row': cell//3 + (block // 3)*3, 'col': cell%3 + (block % 3)* 3, 'block': block}
            for cell in range(9)
        ]
        for block in range(9)
    ]
    print(table_structure)
    return render_template('solver.html', table_structure=table_structure)


@bp.route('/check_valid')
def check_valid():
    table_state = request.data.get('table_state')
    index = request.data.get('index')
    number = request.data.get('Number')
    table = SudokuTable(table_state)
    is_valid = table.is_valid(index, number)
    return {'is_valid': is_valid}