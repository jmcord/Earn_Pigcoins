import Web3 from 'web3';
import ERC20ABI from './ERC20ABI.json'; // Importa el ABI del contrato ERC-20

// Crea una instancia de web3
const web3 = new Web3(window.ethereum);

// Dirección del contrato del token ERC-20
const tokenContractAddress = 0x6B0c84cEFd45855f146B1987e033Ff1E59860a7A; // Coloca aquí la dirección del contrato del token ERC-20

// Crea una instancia del contrato ERC-20 utilizando el ABI y la dirección del contrato
const tokenContract = new web3.eth.Contract(ERC20ABI, tokenContractAddress);

// Función para obtener la dirección del token ERC-20
async function getTokenAddress() {
    try {
        const tokenAddress = await tokenContract.methods.getTokenAddress().call();
        console.log('Dirección del token ERC-20:', tokenAddress);
        return tokenAddress;
    } catch (error) {
        console.error('Error al obtener la dirección del token ERC-20:', error);
        return null;
    }
}

// Llama a la función para obtener la dirección del token ERC-20
getTokenAddress();
