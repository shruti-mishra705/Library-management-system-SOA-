import React from 'react';

const Home = () => (
  <div className="home-container">
    <div className="home-title">📚 Welcome to the Library Management System - SOA</div>
    <div className="home-lead">
      Manage books, users, borrow/return operations, and fines—all in one place.
    </div>
    <img
      className="home-logo"
      src="https://www.edusys.co/images/library.png"
      alt="Library"
    />
    <div className="home-quicknav">
      <h5>Quick Navigation</h5>
      <ul>
        <li>Use the sidebar to access different modules.</li>
        <li>Add and manage books and users.</li>
        <li>Issue or return books and calculate fines.</li>
        <li>Enjoy a seamless library management experience!</li>
      </ul>
    </div>
  </div>
);

export default Home;
