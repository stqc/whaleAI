import Web3 from 'web3';
import router from "../abi/swap.json";

export const web3 = new Web3(new Web3.providers.HttpProvider("https://rpc.blaze.soniclabs.com"));

export const equalizerRouter = new web3.eth.Contract(router.router,"0xf08413857AF2CFBB6edb69A92475cC27EA51453b");

export const WSONIC = "0x591E027153ED4e536275984e1b7573367e11dac4";