import { Request, Response } from 'express';

import { readBooksData, writeBooksData } from '../services/booksService';



export const getBooks = async (req: Request, res: Response) => {
  const query = req.query?.query;

  try {
    const booksData = await readBooksData();

    if (!booksData || booksData.length === 0) {
      res.status(404).send('No books found');
      return;
    }

    if (typeof query === 'string' && query.trim() !== '') {
      const trimmedQuery = query.trim().toLowerCase();
      const filteredBooks = booksData.filter((book: { name: string; }) =>
        book.name.toLowerCase().startsWith(trimmedQuery)
      );

      if (filteredBooks.length === 0) {
        res.status(404).send('No matching books found');
        return;
      }

      res.json(filteredBooks);
    } else {
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
};

export const getBookById = async (req: Request, res: Response) => {
  const bookId = parseInt(req.params.id);

  try {
    const booksData = await readBooksData();

    if (!booksData || booksData.length === 0) {
      res.status(404).send('No books found');
      return;
    }

    const book = booksData.find((b) => b.id === bookId);

    if (book) {
      res.json(book);
    } else {
      res.status(404).send('Book not found');
    }
  } catch (error: any) {
    console.error('Unexpected error:', error);
    res.status(500).send('Failed to read books data. An unexpected error occurred.');
  }
};

export const addBook = async (req: Request, res: Response) => {
  const { id, name, author, isbn } = req.body;

  if (!id || !name || !author || !isbn) {
    return res.status(400).send('Invalid request. Provide book details.');
  }

  try {
    const requestData = JSON.parse(JSON.stringify(req.body));
    const booksData = await readBooksData();

    const existingBookById = booksData.find((b) => b.id === id);

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
};
