import React from 'react';
import { useNavigate } from 'react-router-dom';
import './WelcomeSplash.css';

function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className="welcome-wrapper">
      <div className="hero-card">
        <h1 className="hero-title">BotMyWallet</h1>
        <p className="hero-subtitle">Tu estratega cripto con inteligencia adaptativa</p>
        <button className="hero-button" onClick={() => navigate('/panel')}>
          Acceder al sistema
        </button>
      </div>
    </div>
  );
}

export default Dashboard;
