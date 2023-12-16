import { promises as fs } from 'fs';

interface IBook {
  name: string;
  author: string;
  isbn: string;
  id: number;
}
const initialBooksData = [
  {
    "name": "Harry Potter and the Sorcerer's Stone",
    "author": "J.K. Rowling",
    "isbn": "1234567890",
    "id": 1
  }
];

export const readBooksData = async (): Promise<IBook[]> => {
  try {
    const booksData = await fs.readFile('books.json', 'utf-8');

    if (!booksData.trim()) {
      // File is empty, initialize with initialBooksData
      await writeBooksData(initialBooksData);
      return initialBooksData;
    }

    return JSON.parse(booksData);
  } catch (error) {
    if (error instanceof SyntaxError || (error as any).code === 'ENOENT') {
      // Invalid JSON format or file does not exist, initialize with initialBooksData
      await writeBooksData(initialBooksData);
      return initialBooksData;
    }

    throw error;
  }
};

export const writeBooksData = async (booksData: IBook[]): Promise<void> => {
  try {
    const jsonData = JSON.stringify(booksData, null, 2);
    await fs.writeFile('books.json', jsonData, 'utf-8');
  } catch (error) {
    throw error;
  }
};
