import React, { useState, useEffect } from 'react';
import api from '../services/api';

const BookManagement = () => {
  const [books, setBooks] = useState([]);
  const [newBook, setNewBook] = useState({ id: '', title: '' });
  const [editingBook, setEditingBook] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const response = await api.getBooks();
      setBooks(response.data);
    } catch (error) {
      setMessage('Error fetching books: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddBook = async (e) => {
    e.preventDefault();
    if (!newBook.id || !newBook.title) {
      setMessage('Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);
      await api.addBook({ id: parseInt(newBook.id), title: newBook.title });
      setMessage('Book added successfully!');
      setNewBook({ id: '', title: '' });
      fetchBooks();
    } catch (error) {
      setMessage('Error adding book: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateBook = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await api.updateBook(editingBook.id, { title: editingBook.title });
      setMessage('Book updated successfully!');
      setEditingBook(null);
      fetchBooks();
    } catch (error) {
      setMessage('Error updating book: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBook = async (bookId) => {
    if (window.confirm('Are you sure you want to delete this book?')) {
      try {
        setLoading(true);
        await api.deleteBook(bookId);
        setMessage('Book deleted successfully!');
        fetchBooks();
      } catch (error) {
        setMessage('Error deleting book: ' + (error.response?.data?.message || error.message));
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div>
      <h2>📚 Book Management</h2>
      
      {/* Add New Book Form */}
      <div className="card">
        <div className="card-header">
          <h5>Add New Book</h5>
        </div>
        <div className="card-body">
          <form onSubmit={handleAddBook}>
            <div className="row">
              <div className="col-md-6">
                <div className="form-group">
                  <label>Book ID *</label>
                  <input
                    type="number"
                    className="form-control"
                    value={newBook.id}
                    onChange={(e) => setNewBook({ ...newBook, id: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-group">
                  <label>Title *</label>
                  <input
                    type="text"
                    className="form-control"
                    value={newBook.title}
                    onChange={(e) => setNewBook({ ...newBook, title: e.target.value })}
                    required
                  />
                </div>
              </div>
            </div>
            <button type="submit" className="btn btn-primary mt-3" disabled={loading}>
              {loading ? 'Adding...' : 'Add Book'}
            </button>
          </form>
        </div>
      </div>

      {/* Edit Book Modal */}
      {editingBook && (
        <div className="card mt-3">
          <div className="card-header">
            <h5>Edit Book</h5>
          </div>
          <div className="card-body">
            <form onSubmit={handleUpdateBook}>
              <div className="row">
                <div className="col-md-12">
                  <div className="form-group">
                    <label>Title</label>
                    <input
                      type="text"
                      className="form-control"
                      value={editingBook.title}
                      onChange={(e) => setEditingBook({ ...editingBook, title: e.target.value })}
                    />
                  </div>
                </div>
              </div>
              <button type="submit" className="btn btn-success mt-3" disabled={loading}>
                Update
              </button>
              <button 
                type="button" 
                className="btn btn-secondary mt-3 ms-2"
                onClick={() => setEditingBook(null)}
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Books List */}
      <div className="card mt-3">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h5>Books Library</h5>
          <button className="btn btn-outline-primary" onClick={fetchBooks} disabled={loading}>
            {loading ? 'Loading...' : 'Refresh'}
          </button>
        </div>
        <div className="card-body">
          {books.length === 0 ? (
            <p className="text-muted">No books available. Add some books to get started!</p>
          ) : (
            <div className="row">
              {books.map(book => (
                <div key={book.id} className="col-md-6 col-lg-4 mb-3">
                  <div className="book-item">
                    <h6>📖 {book.title}</h6>
                    <p className="mb-1"><strong>ID:</strong> {book.id}</p>
                    <div className="mt-2">
                      <button
                        className="btn btn-sm btn-outline-primary"
                        onClick={() => setEditingBook(book)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleDeleteBook(book.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {message && (
        <div className={`alert ${message.includes('Error') ? 'alert-danger' : 'alert-success'} mt-3`}>
          {message}
        </div>
      )}
    </div>
  );
};

export default BookManagement;
