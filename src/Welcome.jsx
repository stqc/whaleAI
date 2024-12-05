import React from 'react';
import './css/FomoWallet.css'; // Import the CSS file for styling
import { createWallet } from './utils/walletUtils';

const FomoWallet = () => {

  const passRef = React.createRef();
  const sessionRef = React.createRef();
  return (
    <div className="container" style={{width:"100vw"}}>
        <h1>Welcome to Sonic Terminal</h1>
        <input className='login-page-input' type='password' ref={passRef} placeholder={window.localStorage.getItem("salt")?"Enter your password to login to your wallet":"Set a password to get started"}></input>
        <div className='remember-checkbox'>
          <input type="checkbox" ref={sessionRef} />
        </div>
      <div className="fixed-footer">
        <button className="get-started-button" onClick={()=>{createWallet(passRef.current.value,sessionRef.current.checked)}}>{window.localStorage.getItem("salt")?"Login":"Get Started"}</button>
      </div>
    </div>
  );
};

export default FomoWallet;
