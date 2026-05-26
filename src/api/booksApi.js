import axios from 'axios';

const API = axios.create({
  baseURL: 'https://6a159fcd91ff9a63de0881d3.mockapi.io/books',
  timeout: 8000,
});

export const fetchBooks = () => API.get('/');

export const fetchBookById = (id) => API.get(`/${id}`);

export const createBook = (book) => API.post('/', book);

export const updateBook = (id, book) => API.put(`/${id}`, book);

export const deleteBook = (id) => API.delete(`/${id}`);
