import React, { useState } from 'react';
import MyNFTABI from '../abis/MyNFT.json'; // Importa el ABI del contrato
import Web3 from 'web3';
import NFT1 from '../img/NFT1.png';
import NFT2 from '../img/NFT2.png';

function NFTs() {
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [transactionHash, setTransactionHash] = useState('');

  // Definir los imageIds para cada imagen
  const imageIdNFT1 = 1;
  const imageIdNFT2 = 2;

  // Conectar a la red Ethereum
  async function connectToEthereum() {
    if (window.ethereum) {
      try {
        const web3Instance = new Web3(window.ethereum);
        setWeb3(web3Instance);

        // Solicitar acceso a la cuenta del usuario
        await window.ethereum.request({ method: 'eth_requestAccounts' });

        // Crear una instancia del contrato MyNFT
        const contractAddress = 'MY_NFT_CONTRACT_ADDRESS';
        const contractInstance = new web3Instance.eth.Contract(MyNFTABI, contractAddress);
        setContract(contractInstance);
      } catch (error) {
        console.error(error);
      }
    } else {
      alert('Este sitio web requiere una billetera Ethereum para interactuar con la blockchain');
    }
  }

  // Manejar el envío del formulario de minting
  async function handleMintSubmit(event, imageId) {
    event.preventDefault();
    try {
      // Mintear el NFT llamando al método mint del contrato
      const accounts = await web3.eth.getAccounts();
      const result = await contract.methods.mint(imageId).send({ from: accounts[0], value: web3.utils.toWei('1', 'ether') });
      setTransactionHash(result.transactionHash);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div>
      <h1>Mintear un NFT</h1>
      {transactionHash && (
        <div>
          <p>Transacción exitosa! Hash de transacción: {transactionHash}</p>
        </div>
      )}
      <div style={{ display: 'flex' }}>
        <div>
          <img src={NFT1} alt="NFT1" style={{ width: '200px', height: '200px' }} />
          <button onClick={(event) => handleMintSubmit(event, imageIdNFT1)}>Mintear NFT 1</button>
        </div>
        <div>
          <img src={NFT2} alt="NFT2" style={{ width: '200px', height: '200px' }} />
          <button onClick={(event) => handleMintSubmit(event, imageIdNFT2)}>Mintear NFT 2</button>
        </div>
      </div>
      <button onClick={connectToEthereum}>Conectar a Ethereum</button>
    </div>
  );
}

export default NFTs;
