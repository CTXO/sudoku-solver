from app import db

class SudokuTable(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    difficulty = db.Column(db.String(20), nullable=False)
    initial_state = db.Column(db.String(81), nullable=False, unique=True)
    final_state = db.Column(db.String(81), unique=True)
