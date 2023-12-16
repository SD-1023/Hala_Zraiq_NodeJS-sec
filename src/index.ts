import express from 'express';
import { getBooks, getBookById, addBook } from './controllers/booksController';

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/books', getBooks);
app.get('/books/:id', getBookById);
app.post('/books', addBook);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
