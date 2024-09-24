import React, { useEffect, useState } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import styled from 'styled-components';

const AddressContainer = styled.div`
  display: flex;
  align-items: center;
  font-family: Arial, sans-serif;
  font-size: 14px;
  justify-content: center;
  gap:5px;
  margin-bottom:10px;
`;

const AddressText = styled.span`
  color:#747474;
  font-weight: bold;
`;

const CopyIcon = styled.button`
  padding:0;
  background: transparent;
  border: none;
  cursor: pointer;
  color: #666;
  font-size:0.8rem;
  &:hover {
    color: #000;
  }
    &:focus {
    outline: none;
    border: none;
  }
`;

const AddressCopy = ({ address }) => {
  const [copied, setCopied] = useState(false);

  const displayAddress = address.length > 12
    ? `${address.slice(0, 5)}...${address.slice(-3)}`
    : address;
useEffect(()=>{
    setTimeout(()=>{
        setCopied(false)
    },1000);
},[copied]);
  return (
    <AddressContainer>
      <AddressText>{displayAddress}</AddressText>
      <CopyToClipboard text={address} onCopy={() => setCopied(true)}>
        <CopyIcon aria-label="Copy address">
          {copied ? '✅' : '📋'}
        </CopyIcon>
      </CopyToClipboard>
    </AddressContainer>
  );
};

export default AddressCopy;
