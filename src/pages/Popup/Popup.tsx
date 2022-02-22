import React from 'react';
import './Popup.css';

const Popup = () => {
  return (
    <main className="App">
      <h1 className="header">
        This extension automatically does Membean work.
      </h1>

      <a
        className="go-button"
        href="https://membean.com/dashboard?"
        target="_blank"
        rel="noopener noreferrer"
      >
        Go there now!
      </a>
    </main>
  );
};

export default Popup;
