import { createRef, useEffect, useState } from 'react'

import FomoWallet from './Welcome';
import { doesWalletExist } from './utils/walletUtils';
import PortfolioApp from './Home';

function App() {
  

  return (
      <div>
       {!doesWalletExist() && <FomoWallet/>}
       {doesWalletExist() && <PortfolioApp/>}
    </div>
  )
}

export default App
