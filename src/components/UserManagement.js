import React, { useState, useEffect } from 'react';
import api from '../services/api';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({ id: '', name: '' });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userRecords, setUserRecords] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await api.getUsers();
      setUsers(response.data);
    } catch (error) {
      setMessage('Error fetching users: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    if (!newUser.id || !newUser.name) {
      setMessage('Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);
      await api.registerUser({ ...newUser, id: parseInt(newUser.id) });
      setMessage('User registered successfully!');
      setNewUser({ id: '', name: '' });
      fetchUsers();
    } catch (error) {
      setMessage('Error registering user: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const fetchUserRecords = async (userId) => {
    try {
      setLoading(true);
      const response = await api.getUserRecords(userId);
      setUserRecords(response.data);
      setSelectedUser(userId);
    } catch (error) {
      if (error.response?.status === 404) {
        setUserRecords([]);
        setSelectedUser(userId);
        setMessage('No records found for this user');
      } else {
        setMessage('Error fetching user records: ' + error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>👥 User Management</h2>
      
      {/* Add New User Form */}
      <div className="card">
        <div className="card-header">
          <h5>Register New User</h5>
        </div>
        <div className="card-body">
          <form onSubmit={handleAddUser}>
            <div className="row">
              <div className="col-md-3">
                <div className="form-group">
                  <label>User ID *</label>
                  <input
                    type="number"
                    className="form-control"
                    value={newUser.id}
                    onChange={(e) => setNewUser({ ...newUser, id: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-group">
                  <label>Name *</label>
                  <input
                    type="text"
                    className="form-control"
                    value={newUser.name}
                    onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="col-md-3">
                <div className="form-group">
                  <label>&nbsp;</label>
                  <button type="submit" className="btn btn-primary form-control" disabled={loading}>
                    {loading ? 'Adding...' : 'Register User'}
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Users List */}
      <div className="card">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h5>Registered Users</h5>
          <button className="btn btn-outline-primary" onClick={fetchUsers} disabled={loading}>
            {loading ? 'Loading...' : 'Refresh'}
          </button>
        </div>
        <div className="card-body">
          {users.length === 0 ? (
            <p className="text-muted">No users registered. Register some users to get started!</p>
          ) : (
            <div className="row">
              {users.map(user => (
                <div key={user.id} className="col-md-6 col-lg-4 mb-3">
                  <div className="user-item">
                    <h6>👤 {user.name}</h6>
                    <p className="mb-1"><strong>ID:</strong> {user.id}</p>
                    <button
                      className="btn btn-sm btn-outline-info"
                      onClick={() => fetchUserRecords(user.id)}
                    >
                      View Records
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* User Records */}
      {selectedUser && (
        <div className="card">
          <div className="card-header">
            <h5>Records for User ID: {selectedUser}</h5>
          </div>
          <div className="card-body">
            {userRecords.length === 0 ? (
              <p className="text-muted">No book records found for this user.</p>
            ) : (
              <div className="table-responsive">
                <table className="table table-striped">
                  <thead>
                    <tr>
                      <th>Book ID</th>
                      <th>Issue Date</th>
                      <th>Return Date</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {userRecords.map((record, index) => (
                      <tr key={index}>
                        <td>{record.book_id}</td>
                        <td>{record.issue_date}</td>
                        <td>{record.return_date || 'Not returned'}</td>
                        <td>
                          <span className={`badge ${record.return_date ? 'bg-success' : 'bg-warning'}`}>
                            {record.return_date ? 'Returned' : 'Issued'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
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

export default UserManagement;
