import express, { Request, Response } from 'express';
import path from 'path';
import { promises as fs } from 'fs';

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const initialBooksData = [
  {
    "name": "Harry Potter and the Sorcerer's Stone",
    "author": "J.K. Rowling",
    "isbn": "1234567890",
    "id":"1"
  }
];


const readBooksData = async (): Promise<any[]> => {
  try {
    const booksData = await fs.readFile('books.json', 'utf-8');

    if (!booksData.trim()) {
      // File is empty, initialize with initialBooksData
      await writeBooksData(initialBooksData);
      return initialBooksData;
    }

    return JSON.parse(booksData);
  } catch (error) {
    if (error instanceof SyntaxError) {
      // Invalid JSON format, initialize with initialBooksData
      await writeBooksData(initialBooksData);
      return initialBooksData;
    }

    if ((error as any).code === 'ENOENT') {
      // File does not exist, initialize with initialBooksData
      await writeBooksData(initialBooksData);
      return initialBooksData;
    }

    throw error;
  }
};











const writeBooksData = async (booksData: any[]): Promise<void> => {
  try {
    const jsonData = JSON.stringify(booksData, null, 2);
    await fs.writeFile('books.json', jsonData, 'utf-8');
  } catch (error) {
    throw error;
  }
};



app.get('/books', async (req: Request, res: Response) => {
    const query = req.query?.query;
  
    try {
      const booksData = await readBooksData();
  
      if (!booksData || booksData.length === 0) {
        res.status(404).send('No books found');
        return;
      }
  
      if (typeof query === 'string' && query.trim() !== '') {
        // Valid non-empty query parameter provided, filter books based on the query
        const trimmedQuery = query.trim().toLowerCase();
        const filteredBooks = booksData.filter((book: any) =>
          book.name.toLowerCase().startsWith(trimmedQuery)
        );
  
        if (filteredBooks.length === 0) {
          res.status(404).send('No matching books found');
          return;
        }
  
        res.json(filteredBooks);
      } else {
        // No query parameter provided or an empty string, return the full list of books
        res.json(booksData);
      }
    } catch (error: any) {
      console.error('Error occurred:', error);
  
      if (error instanceof Error) {
        res.status(500).send(`Error: ${error.message}`);
      } else {
        res.status(500).send('An unexpected error occurred.');
      }
    }
  });
  
  
  
  
app.get('/books/:id', async (req: Request, res: Response) => {
    const bookId = parseInt(req.params.id);
  
    try {
      const booksData = await readBooksData();
  
      if (!booksData || booksData.length === 0) {
        res.status(404).send('No books found');
        return;
      }
  
      const book = booksData.find((b: any) => b.id === bookId);
  
      if (book) {
        res.json(book);
      } else {
        res.status(404).send('Book not found');
      }
    } catch (error: any) {
      console.error('Unexpected error:', error);
      res.status(500).send('Failed to read books data. An unexpected error occurred.');
    }
  });









  app.post('/books', async (req: Request, res: Response) => {
    const { id, name, author, isbn } = req.body;
  
    if (!id || !name || !author || !isbn) {
      return res.status(400).send('Invalid request. Provide book details.');
    }
  
    try {
      const requestData = JSON.parse(JSON.stringify(req.body));
      const booksData = await readBooksData();
  
      const existingBookById = booksData.find((b: any) => b.id === id);
  
      if (existingBookById) {
        return res.status(400).send('A book with the same ID already exists.');
      }
  
      const newBook = { id, name, author, isbn };
      booksData.push(newBook);
  
      await writeBooksData(booksData);
      res.send('Book added successfully.');
    } catch (error: any) {
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
