class SudokuTable:
    def __init__(self, sudoku_string):
        if len(sudoku_string) != 81:
            raise SyntaxError("The string must have 81 characters")
        self.string = sudoku_string
        self.done = False
    

    def _solve_rec(self, i):
        if self.string[i] == ".":
            for j in range(10):
                if self.is_valid(j):
                    self.string[i] = str(j)
                    if i < len(self.string) - 1:
                        self._solve_rec(i+1)  
                    else:
                        self.done = True  
                if self.done:
                    break

    def _get_row(self, i):
        return i // 9


    def _get_col(self, i):
        return i % 9
    
    def _get_block(self,i):
        row = self._get_row(i)
        col = self._get_col(i)
        base = row - (row % 3)
        offset = col // 3

        return base + offset

    def _check_row(self, index, number):
        row = self._get_row(index)
        for j in range(9):
            index_to_check = 9*row + j
            if self.string[index_to_check] == str(number) and index_to_check != index:
                return False
        return True
    
    def _check_col(self, index, number):
        col = self._get_col(index)
        for j in range(9):
            index_to_check = col + 9*j
            if self.string[index_to_check] == str(number) and index_to_check != index:
                return False
        return True 

    def _check_block(self, index, number):
        block = self._get_block(index)
        initial_index = (block - (block%3))*9 + (3*(block%3)) 
        for j in range(3):
            for k in range(3):
                index_to_check = initial_index + k
                if self.string[index_to_check] == str(number) and index_to_check != index:
                    return False
            index_to_check += 7 
        return True
    
    
    def is_valid(self, index, number):
        if self._check_block(index, number) \
        and self._check_col(index, number) \
        and self._check_row(index, number):
            return True
        return False
    
    def __str__(self):
        table_string = ""
        for index,char in enumerate(self.string):
            if index > 0:
                if index % 9 == 0: # Start of new row
                    table_string += '\n' 
                    if (index / 9) % 3 == 0: # Start of new block below
                        table_string += '\n' 
                elif index % 3 == 0: # Start of new block to the right
                    table_string += " "
            table_string += char + " "
        return table_string

test_string = "3.65.84..52........87....31..3.1..8.9..863..5.5..9.6..13....25........74..52.63.."

ST = SudokuTable(test_string)

print(ST)
print(ST.is_valid(80, 8))