import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard.js';
import MainPanel from './components/MainPanel.js'; // tu vista final

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/panel" element={<MainPanel />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);