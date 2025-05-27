import React, { useState } from 'react';
import Navigation from './components/Navigation';
import BookManagement from './components/BookManagement';
import UserManagement from './components/UserManagement';
import IssueReturn from './components/IssueReturn';
import FineCalculator from './components/FineCalculator';
import Home from './components/Home'; // 1. Import Home
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('home'); // 2. Default to 'home'

  return (
    <div className="App">
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-3 sidebar">
            <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />
          </div>
          <div className="col-md-9 main-content">
            <div className="content-area">
              {activeTab === 'home' && <Home />}                 {/* 3. Show Home */}
              {activeTab === 'books' && <BookManagement />}
              {activeTab === 'users' && <UserManagement />}
              {activeTab === 'issue-return' && <IssueReturn />}
              {activeTab === 'fines' && <FineCalculator />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
