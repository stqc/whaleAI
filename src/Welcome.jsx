import React from 'react';
import './css/FomoWallet.css'; // Import the CSS file for styling
import { createWallet } from './utils/walletUtils';
const FomoWallet = () => {
  return (
    <div className="container">
      <div className="center-content">
        <img
          src="https://via.placeholder.com/400x300"
          alt="Fomo Wallet"
          width="400"
          height="300"
        />
        <h1>Welcome to Fomo Wallet</h1>
      </div>
      <div className="fixed-footer">
        <button className="get-started-button" onClick={()=>{createWallet()}}>Get Started</button>
      </div>
    </div>
  );
};

export default FomoWallet;
