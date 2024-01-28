document.addEventListener("DOMContentLoaded", function () {
    const sudokuTable = document.getElementById("sudoku-table");
    const solverContainer = document.getElementById("solver-container");

    // Set the height of buttonsContainer equal to the height of sudokuTable
    solverContainer.style.height = sudokuTable.clientHeight + "px";

    // Optional: Add an event listener to adjust the height on window resize
    window.addEventListener("resize", function () {
        solverContainer.style.height = sudokuTable.clientHeight + "px";
    });
});