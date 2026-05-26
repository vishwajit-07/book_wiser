import axios from 'axios';

const API = axios.create({
  baseURL: '/api/books',
  timeout: 8000,
});

export const fetchBooks = () => API.get('/');

export const fetchBookById = (id) => API.get(`/${id}`);

export const createBook = (book) => API.post('/', book);

export const updateBook = (id, book) => API.put(`/${id}`, book);

export const deleteBook = (id) => API.delete(`/${id}`);
