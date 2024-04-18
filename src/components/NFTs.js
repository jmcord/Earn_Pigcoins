import React, { useState, useEffect } from 'react';
import MyNFT from '../abis/MyNFT.json'; // Importa el ABI del contrato
import Web3 from 'web3';
import Navigation from './Navbar';
import MyCarousel from './Carousel';
import NFT1 from '../img/NFT1.png';
import NFT2 from '../img/NFT2.png';

function NFTs() {
  const [account, setAccount] = useState('');
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [transactionHash, setTransactionHash] = useState('');
  const [selectedImageId, setSelectedImageId] = useState(null); // Nuevo estado para el ID de la imagen seleccionada
  const [tokenURIs, setTokenURIs] = useState({}); // Estado para almacenar las URIs de los tokens
  const [selectedTokenURI, setSelectedTokenURI] = useState(''); // Estado para almacenar la URI del token seleccionado

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
          const contractAddress = '0x18E8F015a33f01c74C90A2080bd690B725A67F18'; // Inserta la dirección del contrato aquí
          const contractInstance = new web3Instance.eth.Contract(MyNFT.abi, contractAddress);
          setContract(contractInstance);
          // Verificar si el ABI del contrato se ha cargado correctamente
          console.log('ABI del contrato cargado correctamente:', MyNFT.abi);
          
          // Obtener las URIs de los tokens
          const tokenURIs = {};
          for (let i = 0; i < 2; i++) { // Suponiendo que tienes dos NFTs
            const tokenId = i + 1; // Comenzando desde el token ID 1
            const uri = await contractInstance.methods.tokenURI(tokenId).call();
            tokenURIs[tokenId] = uri;
          }
          setTokenURIs(tokenURIs);
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
      
      // Mintear el NFT llamando al método mintNFT del contrato con el selectedImageId y la URI de la imagen
      const accounts = await web3.eth.getAccounts();
      const result = await contract.methods.mintNFT(accounts[0], `https://gateway.pinata.cloud/ipfs/QmUVck2eNvbUgJiiz6JAvQvhhxW7Xzg2RnLmCVPAnLbo4r`).send({ from: accounts[0] });
      setTransactionHash(result.transactionHash);
    } catch (error) {
      console.error(error);
    }
  }

  // Función para obtener la URI del token seleccionado
  async function handleGetTokenURI(tokenId) {
    try {
      const uri = await contract.methods.tokenURI(tokenId).call();
      setSelectedTokenURI(uri);
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
      <div>
        {Object.keys(tokenURIs).map((tokenId) => (
          <div key={tokenId}>
            <p>Token ID: {tokenId}</p>
            <p>URI: {tokenURIs[tokenId]}</p>
            <button onClick={() => handleGetTokenURI(tokenId)}>Obtener URI</button>
          </div>
        ))}
      </div>
      {selectedTokenURI && (
        <div>
          <p>URI del token seleccionado: {selectedTokenURI}</p>
        </div>
      )}
    </div>
  );
}

export default NFTs;
