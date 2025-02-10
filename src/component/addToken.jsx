import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { addTokenToDB } from '../utils/walletUtils';

const Popup = styled.div`
  background-color: rgb(0, 1, 25);
  width: 300px;
  height: 200px;
  border-radius: 10px;
  box-shadow: 0 0px 50px 10px rgb(1, 32, 62);
  display: flex;
  align-items: center;
  justify-content: center;
  position: fixed;
  z-index:1;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) scale(0); // Start hidden
  visibility: ${props => props.show ? 'visible' : 'hidden'};
  animation: ${props => props.show ? 'growShrink 0.5s forwards' : ''};

  @keyframes growShrink {
    0% {
      transform: translate(-50%, -50%) scale(0);
    }
    70% {
      transform: translate(-50%, -50%) scale(1.1);
    }
    100% {
      transform: translate(-50%, -50%) scale(1);
    }
  }
`;
const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: transparent;
  border: none;
  cursor: pointer;
  color: rgb(1, 40, 79);
  padding:0;
  outline:none;
  font-size:1rem;
  -webkit-tap-highlight-color: transparent;
  &:hover {
    color: #000;
  }

  &:focus {
    outline: none;
    border: none;
  }
`;

const Input = styled.input`
  width: 80%;
  padding: 8px;
  margin: 8px 0;
  border-radius: 5px;
  border: 1px solid #ccc;
  background-color: #fff;
  color: #333;
`;

const SendButton = styled.button`
  width: 80%;
  padding: 10px;
  background-color: rgb(1, 32, 62); // Green to indicate action
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 10px;
`;

const AddTokenPopUp =(props)=>{

    const [show,UpdateShow] = useState(false);
    const [address, setAddress] = useState('');

    useEffect(()=>{
      UpdateShow(props.show);
    },[])

    return(
    <Popup show={show}>
        <CloseButton onClick={()=>{
          UpdateShow(false);
          props.onClick(props.show?false:true)}}>Close</CloseButton>

        <div style={{ width: '100%', padding: '15px', marginTop:"20px",boxSizing: 'border-box', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Input
          type="text"
          placeholder="Token Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
        <SendButton onClick={async () => {
          await addTokenToDB(address);
          UpdateShow(false); // Optionally close the popup after sending
          props.onClick(props.show?false:true);
        }}>
          Add To Wallet
        </SendButton>
      </div>
          
    </Popup>)
}

export default AddTokenPopUp;