"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const booksController_1 = require("./controllers/booksController");
const app = (0, express_1.default)();
const port = 3000;
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.get('/books', booksController_1.getBooks);
app.get('/books/:id', booksController_1.getBookById);
app.post('/books', booksController_1.addBook);
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
