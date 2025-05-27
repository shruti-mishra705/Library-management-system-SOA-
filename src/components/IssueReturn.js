import React, { useState, useEffect } from 'react';
import api from '../services/api';

const IssueReturn = () => {
  const [books, setBooks] = useState([]);
  const [users, setUsers] = useState([]);
  const [issuedBooks, setIssuedBooks] = useState([]);
  const [issueForm, setIssueForm] = useState({ book_id: '', user_id: '', issue_date: '' });
  const [returnForm, setReturnForm] = useState({ book_id: '', user_id: '', return_date: '' });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchBooks();
    fetchUsers();
    fetchIssuedBooks();
    
    // Set today's date as default
    const today = new Date().toISOString().split('T')[0];
    setIssueForm(prev => ({ ...prev, issue_date: today }));
    setReturnForm(prev => ({ ...prev, return_date: today }));
  }, []);

  const fetchBooks = async () => {
    try {
      const response = await api.getBooks();
      setBooks(response.data);
    } catch (error) {
      console.error('Error fetching books:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await api.getUsers();
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchIssuedBooks = async () => {
    try {
      const response = await api.getIssuedBooks();
      setIssuedBooks(response.data);
    } catch (error) {
      console.error('Error fetching issued books:', error);
    }
  };

  const handleIssueBook = async (e) => {
    e.preventDefault();
    if (!issueForm.book_id || !issueForm.user_id) {
      setMessage('Please select both book and user');
      return;
    }

    try {
      setLoading(true);
      await api.issueBook({
        book_id: parseInt(issueForm.book_id),
        user_id: parseInt(issueForm.user_id),
        issue_date: issueForm.issue_date
      });
      setMessage('Book issued successfully!');
      setIssueForm({ book_id: '', user_id: '', issue_date: issueForm.issue_date });
      fetchIssuedBooks();
    } catch (error) {
      setMessage('Error issuing book: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleReturnBook = async (e) => {
    e.preventDefault();
    if (!returnForm.book_id || !returnForm.user_id) {
      setMessage('Please select both book and user');
      return;
    }

    try {
      setLoading(true);
      const response = await api.returnBook({
        book_id: parseInt(returnForm.book_id),
        user_id: parseInt(returnForm.user_id),
        return_date: returnForm.return_date
      });
      
      const fine = response.data.fine || 0;
      setMessage(`Book returned successfully! ${fine > 0 ? `Fine: $${fine}` : 'No fine.'}`);
      setReturnForm({ book_id: '', user_id: '', return_date: returnForm.return_date });
      fetchIssuedBooks();
    } catch (error) {
      setMessage('Error returning book: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const getBookTitle = (bookId) => {
    const book = books.find(b => b.id === bookId);
    return book ? book.title : `Book ID: ${bookId}`;
  };

  const getUserName = (userId) => {
    const user = users.find(u => u.id === userId);
    return user ? user.name : `User ID: ${userId}`;
  };

  return (
    <div>
      <h2>📖 Issue & Return Books</h2>
      
      {/* Issue Book Form */}
      <div className="card">
        <div className="card-header">
          <h5>Issue Book</h5>
        </div>
        <div className="card-body">
          <form onSubmit={handleIssueBook}>
            <div className="row">
              <div className="col-md-4">
                <div className="form-group">
                  <label>Select Book *</label>
                  <select
                    className="form-control"
                    value={issueForm.book_id}
                    onChange={(e) => setIssueForm({ ...issueForm, book_id: e.target.value })}
                    required
                  >
                    <option value="">Choose a book...</option>
                    {books.filter(book => !issuedBooks.some(ib => ib.book_id === book.id)).map(book => (
                      <option key={book.id} value={book.id}>
                        {book.id} - {book.title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="col-md-4">
                <div className="form-group">
                  <label>Select User *</label>
                  <select
                    className="form-control"
                    value={issueForm.user_id}
                    onChange={(e) => setIssueForm({ ...issueForm, user_id: e.target.value })}
                    required
                  >
                    <option value="">Choose a user...</option>
                    {users.map(user => (
                      <option key={user.id} value={user.id}>
                        {user.id} - {user.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="col-md-3">
                <div className="form-group">
                  <label>Issue Date</label>
                  <input
                    type="date"
                    className="form-control"
                    value={issueForm.issue_date}
                    onChange={(e) => setIssueForm({ ...issueForm, issue_date: e.target.value })}
                  />
                </div>
              </div>
              <div className="col-md-1">
                <div className="form-group">
                  <label>&nbsp;</label>
                  <button type="submit" className="btn btn-success form-control" disabled={loading}>
                    Issue
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Return Book Form */}
      <div className="card">
        <div className="card-header">
          <h5>Return Book</h5>
        </div>
        <div className="card-body">
          <form onSubmit={handleReturnBook}>
            <div className="row">
              <div className="col-md-4">
                <div className="form-group">
                  <label>Select Book *</label>
                  <select
                    className="form-control"
                    value={returnForm.book_id}
                    onChange={(e) => setReturnForm({ ...returnForm, book_id: e.target.value })}
                    required
                  >
                    <option value="">Choose a book...</option>
                    {issuedBooks.map(issued => (
                      <option key={`${issued.book_id}-${issued.user_id}`} value={issued.book_id}>
                        {issued.book_id} - {getBookTitle(issued.book_id)} (User: {getUserName(issued.user_id)})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="col-md-4">
                <div className="form-group">
                  <label>Select User *</label>
                  <select
                    className="form-control"
                    value={returnForm.user_id}
                    onChange={(e) => setReturnForm({ ...returnForm, user_id: e.target.value })}
                    required
                  >
                    <option value="">Choose a user...</option>
                    {[...new Set(issuedBooks.map(issued => issued.user_id))].map(userId => (
                      <option key={userId} value={userId}>
                        {userId} - {getUserName(userId)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="col-md-3">
                <div className="form-group">
                  <label>Return Date</label>
                  <input
                    type="date"
                    className="form-control"
                    value={returnForm.return_date}
                    onChange={(e) => setReturnForm({ ...returnForm, return_date: e.target.value })}
                  />
                </div>
              </div>
              <div className="col-md-1">
                <div className="form-group">
                  <label>&nbsp;</label>
                  <button type="submit" className="btn btn-warning form-control" disabled={loading}>
                    Return
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Currently Issued Books */}
      <div className="card">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h5>Currently Issued Books</h5>
          <button className="btn btn-outline-primary" onClick={fetchIssuedBooks}>
            Refresh
          </button>
        </div>
        <div className="card-body">
          {issuedBooks.length === 0 ? (
            <p className="text-muted">No books currently issued.</p>
          ) : (
            <div className="table-responsive">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>Book ID</th>
                    <th>Book Title</th>
                    <th>User ID</th>
                    <th>User Name</th>
                    <th>Issue Date</th>
                    <th>Days Issued</th>
                  </tr>
                </thead>
                <tbody>
                  {issuedBooks.map((issued, index) => {
                    const issueDate = new Date(issued.issue_date);
                    const today = new Date();
                    const daysIssued = Math.floor((today - issueDate) / (1000 * 60 * 60 * 24));
                    
                    return (
                      <tr key={index} className={daysIssued > 14 ? 'table-warning' : ''}>
                        <td>{issued.book_id}</td>
                        <td>{getBookTitle(issued.book_id)}</td>
                        <td>{issued.user_id}</td>
                        <td>{getUserName(issued.user_id)}</td>
                        <td>{issued.issue_date}</td>
                        <td>
                          {daysIssued} 
                          {daysIssued > 14 && <span className="text-danger"> (Overdue)</span>}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {message && (
        <div className={`alert ${message.includes('Error') ? 'alert-danger' : 'alert-success'}`}>
          {message}
        </div>
      )}
    </div>
  );
};

export default IssueReturn;
