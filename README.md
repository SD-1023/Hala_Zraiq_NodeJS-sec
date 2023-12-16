# Library Management System

## Overview

The Library Management System is a TypeScript-based web application that allows users to manage a collection of books. It provides functionalities ,search for books by name, view details of a specific book, and add new books to the collection.

## Features

- **View Books:** See a list of all available books in the library.
- **Search Books:** Search for books by name, and get filtered results.
- **Add New Book:** Add a new book to the library with details like name, author, ISBN, and ID.

## Technologies Used

- **TypeScript:** The application is built using TypeScript for improved code organization and type safety.
- **Express.js:** The web server is created using the Express.js framework.
- **File System:** Books data is stored and retrieved using the file system.
- **RESTful API:** The application follows RESTful principles for routing and interaction.

## Project Structure

The project is organized into the following structure:

- `src/`: Contains the source code files.
  - `controllers/`: Handles the application logic and routes.
  - `services/`: Provides services for reading and writing data.
  - `index.ts`: Entry point for the application.
- `books.json`: JSON file to store the book data.

## Getting Started

1. **Clone the Repository:**

    ```bash
    git clone https://github.com/your-username/your-repo.git
    cd your-repo
    ```

2. **Install Dependencies:**

    ```bash
    npm install
    ```

3. **Run the Application:**

    ```bash
    npm start
    ```

    The application will be accessible at [http://localhost:3000](http://localhost:3000).
