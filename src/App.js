// src/App.js
import React from 'react';
import Dashboard from './components/Dashboard';

function App() {
  return (
    <div style={{ textAlign: 'center' }}>
      <header style={{ background: '#282c34', padding: '1rem', color: 'white' }}>
        <h1>🚀 Bot my Wallet</h1>
      </header>
      <main>
        <Dashboard />
      </main>
    </div>
  );
}

export default App;
