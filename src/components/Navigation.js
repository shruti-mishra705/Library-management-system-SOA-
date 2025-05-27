import React from 'react';

const Navigation = ({ activeTab, setActiveTab }) => {
  const navItems = [
    { id: 'home', label: 'Home', icon: '🏠' }, // Home tab added here
    { id: 'books', label: 'Book Management', icon: '📚' },
    { id: 'users', label: 'User Management', icon: '👥' },
    { id: 'issue-return', label: 'Issue & Return', icon: '📖' },
    { id: 'fines', label: 'Fine Calculator', icon: '💰' }
  ];

  return (
    <div>
      <h3 className="mb-4">📚 Library System</h3>
      <nav className="nav flex-column">
        {navItems.map(item => (
          <div key={item.id} className="nav-item">
            <button
              className={`nav-link btn btn-link text-start w-100 ${activeTab === item.id ? 'active' : ''}`}
              onClick={() => setActiveTab(item.id)}
            >
              <span className="me-2">{item.icon}</span>
              {item.label}
            </button>
          </div>
        ))}
      </nav>
    </div>
  );
};

export default Navigation;
