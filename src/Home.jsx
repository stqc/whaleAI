import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import Button from './component/Button';
import PortfolioItem from './component/PortfolioItem';
import { addTokenToDB, getAddress, getEtherBalance } from './utils/walletUtils';
import AddressCopy from './component/WalletAddress';
import SendEtherPopUp from './component/Popup';
import AddTokenPopUp from './component/addToken';

const AppContainer = styled.div`
  background: #121212; // Dark theme background
  color: white;
  height: 100vh;
  box-shadow: inset -1px 151px 516px -80px #013e3a;
`;

const PortolioContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap:10px;
    height: calc(100vh - 400px);
    overflow-y:scroll;
    padding:20px
`

const PortFolioHeading = styled.div`
    display:flex;
    height:200px;
    flex-direction:column;
    justify-content: center;
`
const BalanceHeading = styled.div`
    font-size: 1rem;
    text-align:center;
    color:#747474;
`

const Balance = styled.div`
  
  font-size: 3rem;
  text-align:center;
`;

const Actions = styled.div`
  display: flex;
  justify-content: space-evenly;
  margin: 20px 0;
`;

export let HomeStateTrackers={
    balance:{},
    address:{},
    portfolio:{},
    refresh:{}
}

const PortfolioApp = () => {
  // Placeholder data

  useEffect(()=>{
    let port = window.localStorage.getItem("portfolio");
    UpdatePortfolio(JSON.parse(port));
  },[])

  useEffect(()=>{
    if(!window.localStorage.getItem("portfolio")){
      window.localStorage.setItem("portfolio",JSON.stringify({}));
    }
  },[])
  // const portfolio = [
  //   {  logo: 'https://testnet.soniclabs.com/gems/icons/coral.svg', name: 'Coral', amount: 0.31250, address:"0xAF93888cbD250300470A1618206e036E11470149" },
  //   {  logo: 'https://testnet.soniclabs.com/gems/icons/coral.svg', name: 'Diamond', amount: 0.0024, address:"0xe5Da320d3d06e753712B50601a6411EFe3c91Eb3" },
    
  //   // Add other currencies
  // ];

  const [balance,UpdateBalance] = useState(0);
  const [address,UpdateAddress] = useState("0x00000000000000000000000000000000000");
  const [showPOPup,UpdatePopup] = useState(false);
  const [showAddToken,UpdateAddToken] = useState(false);
  const [portfolio,UpdatePortfolio] = useState([]);
  const [refresh,RefreshState] = useState(false);

  HomeStateTrackers.balance["value"]=balance;
  HomeStateTrackers.balance["update"]=UpdateBalance;

  HomeStateTrackers.address["address"]=address;
  HomeStateTrackers.address["update"]=UpdateAddress;

  HomeStateTrackers.portfolio["portfolio"]=portfolio;
  HomeStateTrackers.portfolio["update"]=UpdatePortfolio;

  HomeStateTrackers.refresh["update"] = RefreshState;
  HomeStateTrackers.portfolio["value"] = refresh;
  useEffect(()=>{
    getAddress();
    getEtherBalance();
  },[])

  return (
    <AppContainer>
      <PortFolioHeading>
        <AddressCopy address={address}/>
        <BalanceHeading>Balance</BalanceHeading>
        <Balance> <span style={{fontSize:"1.2rem"}}>$S </span>{Number(balance).toLocaleString()}</Balance>
        <BalanceHeading onClick={()=>{
            RefreshState(refresh?false:true);
            getEtherBalance();
        }}>  ↻  </BalanceHeading>
      </PortFolioHeading>
      {showPOPup && <SendEtherPopUp show={showPOPup?true:false} onClick={UpdatePopup}/>}
      {showAddToken && <AddTokenPopUp show={showAddToken?true:false} onClick={UpdateAddToken}/>}
      <Actions>
        <Button label="💸" labelBottom="Send" onClick={()=>{UpdatePopup(true)}}/>
        <Button label="🔄" labelBottom="Swap" onClick={()=>{addTokenToDB("0xAF93888cbD250300470A1618206e036E11470149")}}/>
        <Button label="📥" labelBottom="Add Token" onClick={()=>{UpdateAddToken(true)}}/>
        {/* <Button label="📜" labelBottom="Create Token" /> */}
      </Actions>
      <PortolioContainer>
      {portfolio && Object.keys(portfolio).map(item => (
        <PortfolioItem key={portfolio[item].name} {...portfolio[item]} refresh={refresh} />
      ))}
      </PortolioContainer>
    </AppContainer>
  );
}

export default PortfolioApp;
