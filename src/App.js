import React, {useState, useEffect} from 'react';
import Web3 from 'web3';
import Chains from './chains.json';
import './App.css';

function App() {
  const [account, setAccount] = useState(undefined);
  const [network, setNetwork] = useState(undefined);
  const [error, setError] = useState('');
  const {ethereum} = window;  //will be empty if no web3 wallet is injected by the browser
  const web3 = ethereum ? new Web3(ethereum) : undefined;

  //initiates connection with web3 wallet
  const connect = async () => {
    const accounts = await web3.eth.requestAccounts();
    console.log(accounts);
  }
  
  //gets account and chainId
  const getAccount = async () => {
    const chainId = await web3.eth.getChainId();
    setNetworkName(chainId);
    const accounts = await web3.eth.getAccounts();
    setAccount(accounts[0]);  //there can be more than one connected accounts!
  };

  //converts chainId to network name, using the JSON from chainId.network
  const setNetworkName = chainId => {
    chainId = parseInt(chainId, 16);  //chainId are hexadecimal, while the JSON list is in decimal
    console.log(`connected to chainID ${chainId}`);
    let chain = Chains.find(c => c.chainId === chainId);
    setNetwork(chain?.name || `private (chain ID: ${chainId})`);
  };

  useEffect(() => {
    //if there's a wallet
    if(web3) {
      getAccount();
      ethereum
        .on('accountsChanged', accounts => setAccount(accounts[0]))
        .on('chainChanged', chainId => setNetworkName(chainId));
    }
    else {
      console.error('no wallet installed!');
      setError('Please install a web3 wallet (like Metamask) and refresh the page');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="App">
    {
      error
      ?
        <div style={{color: 'red'}}>${error}</div>
        :
        account 
        ?
          <>
            <div>Account: {account}</div>
            <div>Network: {network}</div>
          </>
          : 
          <button onClick={connect}>Connect</button>
    }
    </div>
  );
}

export default App;
