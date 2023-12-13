"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const fs_1 = require("fs");
const app = (0, express_1.default)();
const port = 3000;
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
const initialBooksData = [
    {
        "name": "Harry Potter and the Sorcerer's Stone",
        "author": "J.K. Rowling",
        "isbn": "1234567890"
    },
    // Add more book objects as needed
];
const readBooksData = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const booksData = yield fs_1.promises.readFile('books.json', 'utf-8');
        return JSON.parse(booksData);
    }
    catch (error) {
        if (error instanceof SyntaxError) {
            throw new Error('Invalid JSON format in the file');
        }
        if (error.code === 'ENOENT') {
            yield writeBooksData(initialBooksData);
            const newData = yield readBooksData(); // Read the data after writing
            return newData;
        }
        throw error;
    }
});
const writeBooksData = (booksData) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const jsonData = JSON.stringify(booksData, null, 2);
        yield fs_1.promises.writeFile('books.json', jsonData, 'utf-8');
    }
    catch (error) {
        throw error;
    }
});
app.get('/books', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { query } = req.query;
    try {
        const booksData = yield readBooksData();
        if (!booksData || booksData.length === 0) {
            res.status(404).send('No books found');
            return;
        }
        if (query && query.toLowerCase()) {
            const filteredBooks = booksData.filter((book) => book.name.toLowerCase().startsWith(query.toLowerCase()));
            res.json(filteredBooks);
        }
        else {
            res.json(booksData);
        }
    }
    catch (error) { 
        console.error('Error occurred:', error);
        if (error instanceof Error) {
            res.status(500).send(`Error: ${error.message}`);
        }
        else {
            res.status(500).send('An unexpected error occurred.');
        }
    }
}));
app.get('/books/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const bookId = parseInt(req.params.id);
    try {
        const booksData = yield readBooksData();
        if (!booksData || booksData.length === 0) {
            res.status(404).send('No books found');
            return;
        }
        const book = booksData.find((b) => b.id === bookId);
        if (book) {
            res.json(book);
        }
        else {
            res.status(404).send('Book not found');
        }
    }
    catch (error) {
        console.error('Unexpected error:', error);
        res.status(500).send('Failed to read books data. An unexpected error occurred.');
    }
}));
app.post('/books', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id, name, author, isbn } = req.body;
    if (!id || !name || !author || !isbn) {
        return res.status(400).send('Invalid request. Provide book details.');
    }
    try {
        const requestData = JSON.parse(JSON.stringify(req.body));
        const booksData = yield readBooksData();
        const existingBookById = booksData.find((b) => b.id === id);
        if (existingBookById) {
            return res.status(400).send('A book with the same ID already exists.');
        }
        const newBook = { id, name, author, isbn };
        booksData.push(newBook);
        yield writeBooksData(booksData);
        res.send('Book added successfully.');
    }
    catch (error) {
        if (error instanceof SyntaxError) {
            res.status(400).send('Invalid JSON in the request body.');
        }
        else {
            console.error('Unexpected error:', error);
            res.status(500).send('Failed to add the book. An unexpected error occurred.');
        }
    }
}));
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
