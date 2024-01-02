class SudokuTable:
    def __init__(self, sudoku_string):

        self.string = sudoku_string
        self.done = False
        self.debug = False
        if len(sudoku_string) != 81:
            print((sudoku_string))
            raise SyntaxError("The sudoku string must have 81 characters")
        for i, c in enumerate(self.string):
            if c != ".":
                if not c.isdigit():
                    raise ValueError("The sudoku string must have only numbers and dots")
                if not self._is_valid(i, int(c)):
                    raise ValueError("This sudoku board cannot be solved")

            
    def debug_mode(self):
        self.debug = True

    @staticmethod
    def _check_index(i):
        if i > 80:
            raise ValueError("Index cannot be greater than 80")

    def _solve_rec(self, i):
        self._check_index(i)
        if self.string[i] == ".":
            if self.debug:
                print(f"_solve_rec processing . at index {i}")
            for number_attempt in range(1, 10):
                if self.debug:
                    print(f"\tTrying to replace {self.string[i]} with {number_attempt}")
                if self._is_valid(i, number_attempt):
                    if self.debug:
                        print(f"\tReplacing {self.string[i]} with {number_attempt}")
                    self._replace_number(i, number_attempt)
                    if i < len(self.string) - 1:
                        if self.debug:
                            print(f"\tGoing to next recursion with index {i+1}")
                        self._solve_rec(i+1)  
                        if self.debug:
                            print(f"\tRegressing to recursion {i}")

                    else:
                        if self.debug:
                            print(f"Solved!!")
                        self.done = True  
                if self.done:
                    break
            if not self.done:
                self._replace_number(i, '.')
        else:
            self._solve_rec(i + 1)
    
    def solve(self):
        self._solve_rec(0)

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

    def _replace_number(self, index, number):
        self.string = self.string[:index] + str(number) + self.string[index+1:]

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
        base_index = (block - (block%3))*9 + (3*(block%3)) # First index of block
        for j in range(3):
            for k in range(3):
                index_to_check = base_index + k
                if self.string[index_to_check] == str(number) and index_to_check != index:
                    return False
            base_index += 9 
        return True
    
    
    def _is_valid(self, index, number):
        self._check_index(index)
        block_valid = self._check_block(index, number)
        col_valid = self._check_col(index, number)
        row_valid = self._check_row(index, number)
        return block_valid and col_valid and row_valid
    
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



