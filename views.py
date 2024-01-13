from flask import Blueprint
from flask import render_template

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
            {'row': cell//3 + (block // 3)*3, 'col': cell%3 + (block % 3)* 3}
            for cell in range(9)
        ]
        for block in range(9)
    ]
    print(table_structure)
    return render_template('solver.html', table_structure=table_structure)