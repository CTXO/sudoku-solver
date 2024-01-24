import json
from flask import Blueprint
from flask import render_template
from flask import request

from table import SudokuTable

bp = Blueprint('sudoku', __name__, url_prefix='/')

@bp.route('/')
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
    return render_template('solver.html', table_structure=table_structure)


@bp.route('/check_valid', methods=['POST'])
def check_valid():
    request_data = json.loads(request.data)
    table_state = request_data.get('table_state')
    try:
        SudokuTable(table_state)
        return {'is_valid': True}
        
    except:
        return {'is_valid': False}

@bp.route('/solve', methods=['POST'])
def solve():
    request_data = json.loads(request.data)
    table_state = request_data.get('table_state')
    show_steps = request_data.get('show_steps')
    try:
        sudoku_table = SudokuTable(table_state, show_steps)
    except Exception as e:
        raise e
        return {'success': False}
    
    sudoku_table.solve()
    return {'success': True, 'solved_table': sudoku_table.string, 'steps': sudoku_table.steps}
    
    
    
        
    

        