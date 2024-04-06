import React, { useState, useEffect } from 'react';
import MyNFTABI from '../abis/MyNFT.json'; // Importa el ABI del contrato
import Web3 from 'web3';
import NFT1 from '../img/NFT1.png';
import NFT2 from '../img/NFT2.png';
import Navigation from './Navbar';
import MyCarousel from './Carousel';

function NFTs() {
  const [account, setAccount] = useState('');
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [transactionHash, setTransactionHash] = useState('');
  const [selectedImageId, setSelectedImageId] = useState(null); // Nuevo estado para el ID de la imagen seleccionada

  useEffect(() => {
    async function connectToMetaMask() {
      if (window.ethereum) {
        try {
          const web3Instance = new Web3(window.ethereum);
          setWeb3(web3Instance);

          // Solicitar acceso a la cuenta del usuario
          const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
          setAccount(accounts[0]);

          // Crear una instancia del contrato MyNFT
          const contractAddress = '0x6627FBBA2d698561CbeD806e2dd44E990ac7b77D';
          const contractInstance = new web3Instance.eth.Contract(MyNFTABI, contractAddress);
          setContract(contractInstance);
        } catch (error) {
          console.error(error);
        }
      } else {
        alert('MetaMask no detectado. Asegúrate de tener MetaMask instalado y configurado correctamente.');
      }
    }

    connectToMetaMask();
  }, []);

  // Manejar el envío del formulario de minting
async function handleMintSubmit(event) {
  event.preventDefault();
  try {
    if (!contract || selectedImageId === null) {
      console.error('No se ha seleccionado ninguna imagen para mintear o el contrato no está disponible.');
      return;
    }
    
    // Mintear el NFT llamando al método mint del contrato con el selectedImageId
    const accounts = await web3.eth.getAccounts();
    const result = await contract.methods.mint(selectedImageId).send({ from: accounts[0], value: web3.utils.toWei('1', 'ether') });
    setTransactionHash(result.transactionHash);
  } catch (error) {
    console.error(error);
  }
}

  return (
    <div>
      <Navigation account={account} />
      <MyCarousel />
      <h1>Mintear un NFT</h1>
      {transactionHash && (
        <div>
          <p>Transacción exitosa! Hash de transacción: {transactionHash}</p>
        </div>
      )}
      <div style={{ display: 'flex' }}>
        <div>
          <img src={NFT1} alt="NFT1" style={{ width: '200px', height: '200px' }} onClick={() => setSelectedImageId(1)} />
          <button onClick={handleMintSubmit}>Mintear NFT 1</button>
        </div>
        <div>
          <img src={NFT2} alt="NFT2" style={{ width: '200px', height: '200px' }} onClick={() => setSelectedImageId(2)} />
          <button onClick={handleMintSubmit}>Mintear NFT 2</button>
        </div>
      </div>
    </div>
  );
}

export default NFTs;
