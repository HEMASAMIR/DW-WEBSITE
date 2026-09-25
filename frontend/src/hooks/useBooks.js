import { useState, useEffect } from 'react';
import { booksService } from '@/services/books.service';
import { BOOKS_STORE_DATA } from '@/constants/mockData';

export function useBooks() {
  const [books, setBooks] = useState(BOOKS_STORE_DATA);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadBooks() {
      try {
        const data = await booksService.getBooks();
        if (data && data.length > 0) {
          setBooks(data);
        }
      } catch (err) {
        // Fallback set
      } finally {
        setLoading(false);
      }
    }
    loadBooks();
  }, []);

  return { books, loading };
}
