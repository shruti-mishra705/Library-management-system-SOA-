import React, { useState, useEffect } from 'react';
import api from '../services/api';

const FineCalculator = () => {
  const [users, setUsers] = useState([]);
  const [fineForm, setFineForm] = useState({ user_id: '', return_date: '' });
  const [calculateForm, setCalculateForm] = useState({ issue_date: '', return_date: '' });
  const [fineResult, setFineResult] = useState(null);
  const [calculationResult, setCalculationResult] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchUsers();
    
    // Set today's date as default
    const today = new Date().toISOString().split('T')[0];
    setFineForm(prev => ({ ...prev, return_date: today }));
    setCalculateForm(prev => ({ ...prev, return_date: today }));
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await api.getUsers();
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleCalculateUserFine = async (e) => {
    e.preventDefault();
    if (!fineForm.user_id || !fineForm.return_date) {
      setMessage('Please select user and return date');
      return;
    }

    try {
      setLoading(true);
      const response = await api.calculateUserFine(parseInt(fineForm.user_id), fineForm.return_date);
      setFineResult(response.data);
      setMessage('');
    } catch (error) {
      setMessage('Error calculating fine: ' + (error.response?.data?.message || error.message));
      setFineResult(null);
    } finally {
      setLoading(false);
    }
  };

  const handleCalculateFine = async (e) => {
    e.preventDefault();
    if (!calculateForm.issue_date || !calculateForm.return_date) {
      setMessage('Please provide both issue and return dates');
      return;
    }

    try {
      setLoading(true);
      const response = await api.calculateFine(calculateForm.issue_date, calculateForm.return_date);
      setCalculationResult(response.data);
      setMessage('');
    } catch (error) {
      setMessage('Error calculating fine: ' + (error.response?.data?.message || error.message));
      setCalculationResult(null);
    } finally {
      setLoading(false);
    }
  };

  const getUserName = (userId) => {
    const user = users.find(u => u.id === userId);
    return user ? user.name : `User ID: ${userId}`;
  };

  return (
    <div>
      <h2>💰 Fine Calculator</h2>
      
      {/* Calculate Fine for User */}
      <div className="card">
        <div className="card-header">
          <h5>Calculate Fine for User</h5>
        </div>
        <div className="card-body">
          <form onSubmit={handleCalculateUserFine}>
            <div className="row">
              <div className="col-md-5">
                <div className="form-group">
                  <label>Select User *</label>
                  <select
                    className="form-control"
                    value={fineForm.user_id}
                    onChange={(e) => setFineForm({ ...fineForm, user_id: e.target.value })}
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
              <div className="col-md-4">
                <div className="form-group">
                  <label>Return Date *</label>
                  <input
                    type="date"
                    className="form-control"
                    value={fineForm.return_date}
                    onChange={(e) => setFineForm({ ...fineForm, return_date: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="col-md-3">
                <div className="form-group">
                  <label>&nbsp;</label>
                  <button type="submit" className="btn btn-primary form-control" disabled={loading}>
                    {loading ? 'Calculating...' : 'Calculate Fine'}
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Direct Fine Calculation */}
      <div className="card">
        <div className="card-header">
          <h5>Direct Fine Calculation</h5>
        </div>
        <div className="card-body">
          <form onSubmit={handleCalculateFine}>
            <div className="row">
              <div className="col-md-4">
                <div className="form-group">
                  <label>Issue Date *</label>
                  <input
                    type="date"
                    className="form-control"
                    value={calculateForm.issue_date}
                    onChange={(e) => setCalculateForm({ ...calculateForm, issue_date: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="col-md-4">
                <div className="form-group">
                  <label>Return Date *</label>
                  <input
                    type="date"
                    className="form-control"
                    value={calculateForm.return_date}
                    onChange={(e) => setCalculateForm({ ...calculateForm, return_date: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="col-md-4">
                <div className="form-group">
                  <label>&nbsp;</label>
                  <button type="submit" className="btn btn-info form-control" disabled={loading}>
                    {loading ? 'Calculating...' : 'Calculate'}
                  </button>
                </div>
              </div>
            </div>
          </form>
          <small className="text-muted">
            Fine calculation: $2 per day after 14 days grace period
          </small>
        </div>
      </div>

      {/* User Fine Results */}
      {fineResult && (
        <div className="card">
          <div className="card-header">
            <h5>Fine Details for {getUserName(fineResult.user_id)}</h5>
          </div>
          <div className="card-body">
            <div className="row mb-3">
              <div className="col-md-6">
                <h4 className="text-primary">Total Fine: ${fineResult.total_fine}</h4>
              </div>
              <div className="col-md-6 text-end">
                <span className="badge bg-info">User ID: {fineResult.user_id}</span>
              </div>
            </div>
            
            {fineResult.details && fineResult.details.length > 0 && (
              <div className="table-responsive">
                <table className="table table-striped">
                  <thead>
                    <tr>
                      <th>Book ID</th>
                      <th>Issue Date</th>
                      <th>Return Date</th>
                      <th>Days</th>
                      <th>Fine Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {fineResult.details.map((detail, index) => {
                      const issueDate = new Date(detail.issue_date);
                      const returnDate = new Date(detail.return_date);
                      const days = Math.floor((returnDate - issueDate) / (1000 * 60 * 60 * 24));
                      
                      return (
                        <tr key={index} className={detail.fine > 0 ? 'table-warning' : ''}>
                          <td>{detail.book_id}</td>
                          <td>{detail.issue_date}</td>
                          <td>{detail.return_date}</td>
                          <td>{days} days</td>
                          <td>
                            ${detail.fine}
                            {detail.error && <span className="text-danger"> - {detail.error}</span>}
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
      )}

      {/* Direct Calculation Result */}
      {calculationResult && (
        <div className="card">
          <div className="card-header">
            <h5>Fine Calculation Result</h5>
          </div>
          <div className="card-body">
            <div className="row">
              <div className="col-md-6">
                <p><strong>Issue Date:</strong> {calculateForm.issue_date}</p>
                <p><strong>Return Date:</strong> {calculateForm.return_date}</p>
              </div>
              <div className="col-md-6">
                <h4 className="text-primary">Fine: ${calculationResult.fine}</h4>
                {calculationResult.fine === 0 && (
                  <p className="text-success">Book returned within grace period (14 days)</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {message && (
        <div className={`alert ${message.includes('Error') ? 'alert-danger' : 'alert-success'}`}>
          {message}
        </div>
      )}
    </div>
  );
};

export default FineCalculator;
