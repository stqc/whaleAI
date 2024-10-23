import { HomeStateTrackers } from "../Home";
import { equalizerRouter, web3, WSONIC } from "../state/walletState";
import ERC20 from "../abi/erc20.json";
import { WelcomeStateHandler } from "../App";

export function createWallet(){
    const account = web3.eth.accounts.create();
    console.log(account);
    window.localStorage.setItem("wallet",JSON.stringify(account));
    WelcomeStateHandler.wallet.update(true);
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

export async function getTokenPriceIFTM(address,decimals){
    let output = await equalizerRouter.methods.getAmountOut(web3.utils.toWei("1",decimals),address,WSONIC).call();
    const price =web3.utils.fromWei(output.amount,decimals);
    return Number(price).toFixed(2);
}

export async function quickApproveAndSell(address,percentage,decimals){

    let balanceToSell = Number(await getTokenBalance(address))*percentage;

    const account = JSON.parse(window.localStorage.getItem("wallet"));

    const privateKey = account.privateKey; // Assuming the key is stored under privateKey
    balanceToSell = balanceToSell.toFixed(0)

    const contract = new web3.eth.Contract(ERC20.ERC20,address);
    const txData = contract.methods.approve(equalizerRouter._address, web3.utils.toWei(await getTokenBalance(address),decimals)).encodeABI();
    const nonce = await web3.eth.getTransactionCount(account.address, 'latest');

    // Build the transaction object
    const tx = {
        from: account.address,
        to: address, // ERC-20 contract address
        data: txData, // The encoded data to approve tokens
        nonce: nonce
    };

    tx.gas = await web3.eth.estimateGas(tx);
    tx.gasPrice = await web3.eth.getGasPrice();

    const signedTx = await web3.eth.accounts.signTransaction(tx, privateKey);

    web3.eth.sendSignedTransaction(signedTx.rawTransaction)
    .on('receipt', async function (receipt) {
        console.log('Transaction successful with receipt: ', receipt);
        await sellTransaction(account,balanceToSell.toString(),address);
    })
    .on('error', function (error) {
        console.log('Error during the transaction: ', error);
    });
}

export async function sellTransaction(account,balanceToSell,address){
    
    try{
    const txData = equalizerRouter.methods.swapExactTokensForETHSupportingFeeOnTransferTokens(
        balanceToSell,
        0,
        [{from:address,to:WSONIC,stable:true}],
        account.address,
        Math.floor(Date.now() / 1000) + 60 * 100
    ).encodeABI();

    console.log(balanceToSell);

    const nonce = await web3.eth.getTransactionCount(account.address, 'latest');

    const tx = {
        from: account.address,
        to: equalizerRouter._address, // ERC-20 contract address
       
        data: txData, // The encoded data to approve tokens
        nonce: nonce
    };

    tx.gas = await web3.eth.estimateGas(tx);
    tx.gasPrice = await web3.eth.getGasPrice();
    
    
    const signedTx = await web3.eth.accounts.signTransaction(tx, account.privateKey);

    web3.eth.sendSignedTransaction(signedTx.rawTransaction)
    .on('transactionHash', function (hash) {
        console.log('Transaction broadcasted with hash:', hash);
        alert('Transaction broadcasted. Check the hash on the explorer: ' + hash);
    })
    .on('receipt', function (receipt) {
        alert('Transaction successful with receipt: ', receipt);
    })
    .on('error', function (error) {
        alert('Error during the transaction: ', error);
    });
}
catch(x){
    console.log(false)
    const txData = equalizerRouter.methods.swapExactTokensForETHSupportingFeeOnTransferTokens(
        balanceToSell,
        0,
        [{from:address,to:WSONIC,stable:false}],
        account.address,
        Math.floor(Date.now() / 1000) + 60 * 100
    ).encodeABI();

    console.log(balanceToSell);

    const nonce = await web3.eth.getTransactionCount(account.address, 'latest');

    const tx = {
        from: account.address,
        to: equalizerRouter._address, // ERC-20 contract address
       
        data: txData, // The encoded data to approve tokens
        nonce: nonce
    };

    tx.gas = await web3.eth.estimateGas(tx);
    tx.gasPrice = await web3.eth.getGasPrice();
    
    
    const signedTx = await web3.eth.accounts.signTransaction(tx, account.privateKey);

    web3.eth.sendSignedTransaction(signedTx.rawTransaction)
    .on('transactionHash', function (hash) {
        console.log('Transaction broadcasted with hash:', hash);
        alert('Transaction broadcasted. Check the hash on the explorer: ' + hash);
    })
    .on('receipt', function (receipt) {
        alert('Transaction successful with receipt: ', receipt);
    })
    .on('error', function (error) {
        alert('Error during the transaction: ', error);
    });
}
}


export async function quickBuy(address,FTM) {

    const account = JSON.parse(window.localStorage.getItem("wallet"));
    const nonce = await web3.eth.getTransactionCount(account.address, 'latest');

    const txData = equalizerRouter.methods.swapExactETHForTokensSupportingFeeOnTransferTokens(
        0,
        [{to:address,from:WSONIC,stable:false}],
        account.address,
        Math.floor(Date.now() / 1000) + 60 * 1000
    ).encodeABI();
    
    const tx = {
        from: account.address,
        to: equalizerRouter._address,  // Router contract address
        data: txData,       // Encoded ABI for swap
        value: FTM/1e6,  // The amount of ETH you are sending with the transaction
        nonce: nonce
    };

    tx.gas = await web3.eth.estimateGas(tx);
    tx.gasPrice = await web3.eth.getGasPrice();

    const signedTx = await web3.eth.accounts.signTransaction(tx, account.privateKey);

    web3.eth.sendSignedTransaction(signedTx.rawTransaction)
    .on('receipt', function (receipt) {
        alert('Transaction successful with receipt: ', receipt);
    })
    .on('error', function (error) {
        alert('Error during the transaction: ', error);
    });
}