const express = require('express');
const path = require('path');
const fs = require('fs').promises;

const app = express();
const port = 3000;

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const initialBooksData = [
  {
    "id": 1,
    "name": "Harry Potter and the Sorcerer's Stone"
  },
  {
    "id": 2,
    "name": "Harry Potter and the Chamber of Secrets"
  },
  {
    "id": 3,
    "name": "Harry Potter and the Prisoner of Azkaban"
  },
];

const readBooksData = async () => {
  try {
    const booksData = await fs.readFile('books.json', 'utf-8');
    return JSON.parse(booksData);
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new Error('Invalid JSON format in the file');
    }

    if (error.code === 'ENOENT') {
      await writeBooksData(initialBooksData);
      return initialBooksData;
    }

    throw error;
  }
};

const writeBooksData = async (booksData) => {
  try {
    const jsonData = JSON.stringify(booksData, null, 2);
    await fs.writeFile('books.json', jsonData, 'utf-8');
  } catch (error) {
    throw error;
  }
};

app.get('/books', async (req, res) => {
  try {
    const booksData = await readBooksData();

    if (!booksData || booksData.length === 0) {
      res.status(404).send('No books found');
      return;
    }

    res.render('books', { books: booksData });
  } catch (error) {
    if (error.message === 'Invalid JSON format in the file') {
      res.status(500).send('Invalid JSON format in the file');
    } else {
      console.error('Unexpected error:', error);
      res.status(500).send('Failed to read books data. An unexpected error occurred.');
    }
  }
});

app.get('/books/:id', async (req, res) => {
  const bookId = parseInt(req.params.id);

  try {
    const booksData = await readBooksData();

    if (!booksData || booksData.length === 0) {
      res.status(404).send('No books found');
      return;
    }

    const book = booksData.find((b) => b.id === bookId);

    if (book) {
      res.render('bookDetails', { book });
    } else {
      res.status(404).send('Book not found');
    }
  } catch (error) {
    if (error.message === 'Invalid JSON format in the file') {
      res.status(500).send('Invalid JSON format in the file');
    } else {
      console.error('Unexpected error:', error);
      res.status(500).send('Failed to read books data. An unexpected error occurred.');
    }
  }
});

app.post('/books', async (req, res) => {
  const { id, name } = req.body;

  if (!id || !name) {
    return res.status(400).send('Invalid request. Provide book details.');
  }

  try {
    const requestData = JSON.parse(JSON.stringify(req.body));
    const booksData = await readBooksData();

    const existingBookById = booksData.find((b) => b.id === id);
    const existingBookByName = booksData.find((b) => b.name.toLowerCase() === name.toLowerCase());

    if (existingBookById && existingBookByName) {
      return res.status(400).send('A book with the same ID and name already exists.');
    } else if (existingBookById) {
      return res.status(400).send('A book with the same ID already exists.');
    } else if (existingBookByName) {
      return res.status(400).send('A book with the same name already exists.');
    }

    const newBook = { id, name };
    booksData.push(newBook);

    await writeBooksData(booksData);
    res.send('Book added successfully.');
  } catch (error) {
    if (error instanceof SyntaxError) {
      res.status(400).send('Invalid JSON in the request body.');
    } else {
      console.error('Unexpected error:', error);
      res.status(500).send('Failed to add the book. An unexpected error occurred.');
    }
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
