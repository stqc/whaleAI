import { HomeStateTrackers } from "../Home";
import { web3 } from "../state/walletState";
import ERC20 from "../abi/erc20.json";

export function createWallet(){
    const account = web3.eth.accounts.create();
    console.log(account);
    window.localStorage.setItem("wallet",JSON.stringify(account));
}

export function doesWalletExist(){
    if(window.localStorage.getItem("wallet")){return true;}
    return false;
}

export function getAddress(){
    const account = JSON.parse(window.localStorage.getItem("wallet"));
    HomeStateTrackers.address.update(account.address);
}

export async function getEtherBalance(){
    const account = JSON.parse(window.localStorage.getItem("wallet"));
    let balance = await web3.eth.getBalance(account.address);
    balance = web3.utils.fromWei(balance,"ether");
    HomeStateTrackers.balance.update(balance);
}

export async function sendEther(address,amount){
    const account = JSON.parse(window.localStorage.getItem("wallet"));

    const privateKey = account.privateKey; // Assuming the key is stored under privateKey

    const key = privateKey.startsWith('0x') ? privateKey : '0x' + privateKey;

    const tx = {
        to: address,
        value: web3.utils.toWei(amount, 'ether'),
        gas: 2000000, // Set gas limit to 2,000,000 Gwei
    };

    try{
    tx.gas = await web3.eth.estimateGas(tx);
    tx.gasPrice = await web3.eth.getGasPrice();

        // Get the current transaction count for the nonce
    const nonce = await web3.eth.getTransactionCount(account.address, 'latest');
    tx.nonce = nonce;

        // Sign the transaction
    const signedTx = await web3.eth.accounts.signTransaction(tx, key);

        // Send the signed transaction
    const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
    console.log(receipt);
    alert(`Transaction receipt: ${receipt.transactionHash}`);
    
    getEtherBalance();
    
    return receipt; // Return transaction receipt

    } catch (error) {
        console.log(error)
        alert('Sending Ether failed:', error);
        throw new Error('Failed to send Ether');
    }
    
}

export async function getTokenData(address){
    const account = JSON.parse(window.localStorage.getItem("wallet"));
    const contract = new web3.eth.Contract(ERC20.ERC20,address);
    const tokenInfo = {
        tokenAddress:contract._address,
        name: await contract.methods.name().call(),
        symbol: await contract.methods.symbol().call(),
        decimals: Number(await contract.methods.decimals().call()),
        address: contract._address,

    }

    return tokenInfo;
}

export async function addTokenToDB(address){
 
    let data =await getTokenData(address);
    data['logo']="https://testnet.soniclabs.com/gems/icons/coral.svg";
    
    let portfolio = JSON.parse(window.localStorage.getItem("portfolio"));

    portfolio[data.address]=data;
    HomeStateTrackers.portfolio.update(portfolio);
    window.localStorage.setItem("portfolio",JSON.stringify(portfolio));

}


export async function getTokenBalance(address){
    const account = JSON.parse(window.localStorage.getItem("wallet"));
    const contract = new web3.eth.Contract(ERC20.ERC20,address);
    const balance = await contract.methods.balanceOf(account.address).call();
    
    return balance;
}

export async function removeFromPortfolio(address){
   
    let portfolio = JSON.parse(window.localStorage.getItem("portfolio"));

    delete portfolio[address];
    HomeStateTrackers.portfolio.update(portfolio);
    window.localStorage.setItem("portfolio",JSON.stringify(portfolio));

}