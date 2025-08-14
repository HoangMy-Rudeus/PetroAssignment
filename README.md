# PetroAssignment

This repository showcases my ability to analyze requirements, design efficient solutions, and deliver clean, maintainable code. The assignment demonstrates best practices in code review, refactoring, and JavaScript development with a focus on performance optimization and error handling.

## Project Overview

This assignment focuses on **code review and refactoring** skills, specifically analyzing and improving a JavaScript CSV import function. The project demonstrates:

- **Code Quality Analysis**: Identifying issues with maintainability, performance, and best practices
- **Refactoring Skills**: Transforming legacy code into modern, efficient solutions
- **Error Handling**: Implementing robust error management and user experience improvements
- **Performance Optimization**: Adding batching, retry mechanisms, and progress tracking
- **Modern JavaScript**: Utilizing ES6+ features, async/await, and modular design patterns

## Project Structure

```text
PetroAssignment/
├── README.md                           # Project overview and navigation
└── task-1/                            # Task 1: Code Review & Refactoring
    ├── task-1.md                      # Task description and analysis
    ├── source.js                      # Original problematic code
    └── suggest-code-task-1.js         # Refactored solution
```

## Task 1 - Code Review and Refactoring

### Objective

Review and refactor a JavaScript CSV import function, identifying code quality issues and implementing comprehensive improvements.

### Files

- **[Task Description & Analysis](./task-1/task-1.md)** - Detailed task requirements, identified issues, and improvement proposals
- **[Original Source Code](./task-1/source.js)** - The problematic JavaScript function requiring review
- **[Refactored Solution](./task-1/suggest-code-task-1.js)** - Improved implementation with modern best practices

### Key Improvements Implemented

1. **Input Validation** - Comprehensive parameter validation with clear error messages
2. **Error Handling** - Robust error management with retry mechanisms and timeout handling
3. **Performance Optimization** - Batch processing and concurrent request management
4. **Code Modularity** - Separation of concerns with utility functions
5. **Modern JavaScript** - ES6+ syntax, async/await, and Promise-based architecture
6. **User Experience** - Progress tracking and informative notifications
7. **Maintainability** - Clean code structure with proper documentation

### Issues Identified

- Poor error handling and validation
- Performance bottlenecks with large datasets
- Tight coupling and lack of modularity
- Memory inefficiency in data processing
- Missing edge case handling
- Outdated JavaScript patterns

## Getting Started

1. **Clone the repository:**

   ```bash
   git clone https://github.com/HoangMy-Rudeus/PetroAssignment.git
   cd PetroAssignment
   ```

2. **Navigate to Task 1:**

   ```bash
   pnpm install
   pnpm serve
   ```

3. **Review the files:**
   - Start with `task-1.md` for the complete analysis
   - Compare `source.js` (original) with `suggest-code-task-1.js` (refactored)
