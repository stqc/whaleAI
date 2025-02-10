import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { getTokenBalance, getTokenPriceIFTM, quickApproveAndSell, quickBuy, removeFromPortfolio } from '../utils/walletUtils';
import { web3 } from '../state/walletState';
import { externalShowSendToken } from './Popup';

const ItemContainer = styled.div`
  display: flex;
  justify-content: space-between;
  color: white;
  border-radius:15px;
  position:relative;
  margin-top:10px
`;

const ItemContainerMain = styled.div`
  display: flex;
  justify-content: space-between;
  background: #33333345; // Dark background for each item
  color: white;
  padding: 20px;
  border-radius:15px;
  position:relative;
  flex-direction:column;
`;

const CurrencyLogo = styled.img`
  height: 40px;
  width: 40px;
`;

const CurrencyDetails = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-end;
`;

const Remove = styled.div`
position:absolute;
top:0;
right:0;
color: rgb(1, 40, 79);
font-size:1.2rem;
margin-right:10px;
font-weight:800`

const QuickSell = styled.div`
padding:2px 5px;
background-color: rgb(1, 40, 79);
border: 1px solid rgb(1, 32, 62);
color: black;
font-weight: 800;
font-size:0.7rem;
`
const PortfolioItem = ({ logo, name, symbol, price, change, decimals, tokenAddress, refresh }) =>{ 
  
  const [balance,UpdateBalance] = useState(0);
  const [Price,UpdatePrice] = useState(0);
  
  useEffect(()=>{
      const balanceUpdate = async ()=>{
        UpdateBalance(web3.utils.fromWei(await getTokenBalance(tokenAddress),decimals));
       UpdatePrice( await getTokenPriceIFTM(tokenAddress,decimals));
      }
      balanceUpdate();
  },[refresh])
  
  return(
  <ItemContainerMain>
    <Remove onClick={()=>{removeFromPortfolio(tokenAddress)}}>X</Remove>
  <ItemContainer>
    
    <CurrencyLogo src={logo} alt={name} />

    <CurrencyDetails>
      <span>{name}</span>
      <span>{balance} {symbol}</span>
      <span>Price: {Price} S</span>
    </CurrencyDetails>
   
  </ItemContainer>
  {/* <div style={{display:"flex", gap:"5px", marginTop:"10px", justifyContent:"flex-end"}}>
    <span style={{marginRight:"auto"}}>Quick Buy:</span>
      <QuickSell onClick={()=>{quickBuy(tokenAddress,1*1e18)}}>1S</QuickSell>
      <QuickSell onClick={()=>{quickBuy(tokenAddress,5*1e18,decimals)}}>5S</QuickSell>
      <QuickSell onClick={()=>{quickBuy(tokenAddress,100*1e18,decimals)}}>100S</QuickSell>
      <QuickSell onClick={()=>{quickBuy(tokenAddress,500*1e18,decimals)}}>500S</QuickSell>
  </div>
  <div style={{display:"flex", gap:"5px", marginTop:"10px", justifyContent:"flex-end"}}>
    <span style={{marginRight:"auto"}}>Quick Sell:</span>
      <QuickSell onClick={()=>{quickApproveAndSell(tokenAddress,0.25,decimals)}}>25%</QuickSell>
      <QuickSell onClick={()=>{quickApproveAndSell(tokenAddress,0.5,decimals)}}>50%</QuickSell>
      <QuickSell onClick={()=>{quickApproveAndSell(tokenAddress,0.75,decimals)}}>75%</QuickSell>
      <QuickSell onClick={()=>{quickApproveAndSell(tokenAddress,1,decimals)}}>100%</QuickSell>
  </div> */}
  <button style={{marginTop:"10px", backgroundColor:"rgb(1, 32, 62)"}} onClick={()=>{
    externalShowSendToken(true);
  }}>Send</button>
  </ItemContainerMain>
);}

export default PortfolioItem;
