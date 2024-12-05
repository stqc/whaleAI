import { createRef, useEffect, useState } from 'react'

import FomoWallet from './Welcome';
import { doesWalletExist } from './utils/walletUtils';
import PortfolioApp from './Home';


export let WelcomeStateHandler={
  wallet:{}
}

function App() {

  const [wallet,UpdateWallet] = useState(false);

  WelcomeStateHandler.wallet["update"]=UpdateWallet;

  useEffect(()=>{
    
    (async()=>{
      UpdateWallet(await doesWalletExist());
    })();

  },[])

  return (
      <div>
       {!wallet && <FomoWallet/>}
       {wallet && <PortfolioApp/>}
    </div>
  )
}

export default App
