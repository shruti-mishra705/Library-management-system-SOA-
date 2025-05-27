import axios from 'axios';

const API_BASE_URLS = {
  books: 'http://localhost:5001',
  borrowers: 'http://localhost:5002',
  fines: 'http://localhost:5003'
};

const api = {
  // Book Service APIs
  getBooks: () => axios.get(`${API_BASE_URLS.books}/books`),
  getBook: (id) => axios.get(`${API_BASE_URLS.books}/books/${id}`),
  addBook: (book) => axios.post(`${API_BASE_URLS.books}/books`, book),
  updateBook: (id, book) => axios.put(`${API_BASE_URLS.books}/books/${id}`, book),
  deleteBook: (id) => axios.delete(`${API_BASE_URLS.books}/books/${id}`),

  // Borrower Service APIs
  getUsers: () => axios.get(`${API_BASE_URLS.borrowers}/users`),
  registerUser: (user) => axios.post(`${API_BASE_URLS.borrowers}/users`, user),
  issueBook: (issueData) => axios.post(`${API_BASE_URLS.borrowers}/issue`, issueData),
  returnBook: (returnData) => axios.post(`${API_BASE_URLS.borrowers}/return`, returnData),
  getUserRecords: (userId) => axios.get(`${API_BASE_URLS.borrowers}/records/${userId}`),
  getIssuedBooks: () => axios.get(`${API_BASE_URLS.borrowers}/issued`),
  calculateUserFine: (userId, returnDate) => 
    axios.post(`${API_BASE_URLS.borrowers}/fine/${userId}`, { return_date: returnDate }),

  // Fine Service APIs
  calculateFine: (issueDate, returnDate) => 
    axios.post(`${API_BASE_URLS.fines}/calculate`, { issue_date: issueDate, return_date: returnDate }),
  getUserFine: (userId) => axios.get(`${API_BASE_URLS.fines}/calculate/${userId}`)
};

export default api;
