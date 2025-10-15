# Matrix Game Solver Using the Simplex Method

## Project Description

This project is an interactive web-based matrix game solver developed in JavaScript using the simplex method. The project was created as part of the "Game Theory" course at ITMO University under the guidance of lecturer Kochevadov.

## Functionality

### Main functions:
- **Input of matrices of arbitrary size** (up to 6x6)
- **Step-by-step solution** with visualization of simplex tables
- **Automatic solution** with output of optimal strategies
- **Examples of ready-made matrices** for testing
- **Saving state** between sessions

### Mathematical apparatus:
- Solution of zero-sum matrix games
- Transformation to a linear programming problem
- Simplex method with step-by-step visualization
- Calculation of optimal mixed strategies
- Determining the game price

### Transformation to linear programming
Change of variables: xᵢ = pᵢ/v
Objective function: Minimize 1/v

## Usage

### Step 1: Specify the matrix dimensions
- Specify the number of rows (Player A) and columns (Player B)
- Click "Create Matrix"

### Step 2: Entering the Payoff Matrix
- Fill in the matrix values
- Or select a ready-made example from the list

### Step 3: Solving
- Click "Start Solving" for a step-by-step preview
- Use the navigation buttons to navigate through the iterations
- Click "Auto Solve" to get the final result

## Implementation Features

### Technical Stack:
- **HTML5/CSS3** - structure and formatting
- **Vanilla JavaScript** - application logic
- **MathJax** - displaying mathematical formulas
- **Session Storage** - saving state

### Algorithmic Features:
- Implementation of the full simplex method
- Automatic selection of resolving elements
- Handling singular cases
- Input data validation

*Developed as part of the "Game Theory" course, ITMO University*
