import apiClient from './api';
import { API_ENDPOINTS } from '@/constants/apiRoutes';
import { fetchFile } from './courses.service';
import { withAdminAccess } from './adminAccess';

const LEVEL_ORDER = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

function normalizeBook(book) {
  return {
    id: book.id,
    name: book.name,
    level: book.level,
    price: book.price === null || book.price === undefined ? null : Number(book.price),
    isActive: book.is_active !== false,
    hasAccess: !!book.has_access,
  };
}

/** The API groups books by level ({ "A1": [...], "A2": [...] }); we flatten + sort. */
function toBookList(data) {
  const flat = Array.isArray(data) ? data : data && typeof data === 'object' ? Object.values(data).flat() : [];
  return flat
    .map(normalizeBook)
    .filter((b) => b.isActive)
    .sort((a, b) => {
      const ai = LEVEL_ORDER.indexOf(a.level);
      const bi = LEVEL_ORDER.indexOf(b.level);
      return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi) || a.id - b.id;
    });
}

export const booksService = {
  getBooks: async () => toBookList((await apiClient.get(API_ENDPOINTS.BOOKS)).data),

  /** Real catalog for visitors who are not logged in (served by the site, see lib/publicCatalog). */
  getPublicBooks: async () => toBookList((await apiClient.get('/public-data/books')).data),

  viewBook: (book, onProgress) =>
    withAdminAccess('book', book.id, () => fetchFile(API_ENDPOINTS.BOOK_VIEW(book.id), `${book.name || 'book'}.pdf`, onProgress)),
};
