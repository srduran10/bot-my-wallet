import React from 'react';
import './WelcomeSplash.css';

function WelcomeSplash() {
  return (
    <div className="welcome-wrapper">
      <div className="hero-card">
        <h1 className="hero-title">BotMyWallet</h1>
        <p className="hero-subtitle">Tu estratega cripto con inteligencia adaptativa</p>
        <button className="hero-button">Entrar al Dashboard</button>
      </div>
    </div>
  );
}

export default WelcomeSplash;
