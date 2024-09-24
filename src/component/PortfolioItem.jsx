import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { getTokenBalance, removeFromPortfolio } from '../utils/walletUtils';
import { web3 } from '../state/walletState';

const ItemContainer = styled.div`
  display: flex;
  justify-content: space-between;
  background: #33333345; // Dark background for each item
  color: white;
  padding: 20px;
  border-radius:15px;
  position:relative;
`;

const CurrencyLogo = styled.img`
  height: 40px;
  width: 40px;
`;

const CurrencyDetails = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
`;

const Remove = styled.div`
position:absolute;
top:0;
right:0;
color: #013e3a;
font-size:1.2rem;
margin-right:10px;
font-weight:800`


const PortfolioItem = ({ logo, name, symbol, price, change, decimals, tokenAddress, refresh }) =>{ 
  
  const [balance,UpdateBalance] = useState(0);
  
  useEffect(()=>{
      const balanceUpdate = async ()=>{
        UpdateBalance(web3.utils.fromWei(await getTokenBalance(tokenAddress),decimals));
      }
      balanceUpdate();
      console.log("hello");
  },[refresh])
  
  return(
  <ItemContainer>
    <Remove onClick={()=>{removeFromPortfolio(tokenAddress)}}>X</Remove>
    <CurrencyLogo src={logo} alt={name} />

    <CurrencyDetails>
      <span>{name}</span>
      <span>{balance} {symbol}</span>
    </CurrencyDetails>
    {/* <div>
      <span>${price}</span>
      <PriceChange isPositive={change >= 0}>
        {change >= 0 ? `+${change}` : change}
      </PriceChange>
    </div> */}
  </ItemContainer>
);}

export default PortfolioItem;
