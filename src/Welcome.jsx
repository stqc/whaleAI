import React from 'react';
import './css/FomoWallet.css'; // Import the CSS file for styling
import { createWallet } from './utils/walletUtils';

const FomoWallet = () => {

  const passRef = React.createRef();
  return (
    <div className="container" style={{width:"100vw"}}>
        <h1>Welcome To WhaleAI Wallet</h1>
        <input className='login-page-input' type='password' ref={passRef} placeholder={window.localStorage.getItem("hashedPass")?"Enter your password to login to your wallet":"Set a password to get started"}></input>

      <div className="fixed-footer">
        <button className="get-started-button" onClick={()=>{createWallet(passRef.current.value)}}>{window.localStorage.getItem("hashedPasss")?"Login":"Get Started"}</button>
      </div>
    </div>
  );
};

export default FomoWallet;
