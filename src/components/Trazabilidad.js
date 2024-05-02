import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import Swal from 'sweetalert2';
import trazabilidad from '../abis/trazabilidad.json';

function TrazabilidadGanaderia() {
  const [totalAnimales, setTotalAnimales] = useState(0);
  const [animales, setAnimales] = useState({});
  const [loading, setLoading] = useState(true);
  const [idAnimal, setIdAnimal] = useState('');
  const [nombreAnimal, setNombreAnimal] = useState('');
  const [razaAnimal, setRazaAnimal] = useState('');
  const [fechaNacimientoAnimal, setFechaNacimientoAnimal] = useState('');
  const [idAnimalTransferir, setIdAnimalTransferir] = useState('');
  const [nuevoPropietario, setNuevoPropietario] = useState('');
  const [historial, setHistorial] = useState([]);
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState('');

  useEffect(() => {
    async function loadBlockchainData() {
      // Cargar Web3
      if (window.ethereum) {
        window.web3 = new Web3(window.ethereum);
        await window.ethereum.request({ method: 'eth_requestAccounts' });
      } else if (window.web3) {
        window.web3 = new Web3(window.web3.currentProvider);
      } else {
        window.alert('¡Deberías considerar usar Metamask!');
      }

      const web3 = window.web3;
      const accounts = await web3.eth.getAccounts();
      setAccount(accounts[0]);

      const networkId = await web3.eth.net.getId();
      const deployedNetwork = trazabilidad.networks[networkId];
      const contractInstance = new web3.eth.Contract(
        trazabilidad.abi,
        deployedNetwork && deployedNetwork.address
      );
      setContract(contractInstance);

      // Obtener el total de animales
      const totalAnimales = await contractInstance.methods.totalAnimales().call();
      setTotalAnimales(parseInt(totalAnimales));

      // Cargar datos de animales
      const animalesData = {};
      for (let i = 1; i <= totalAnimales; i++) {
        const animal = await contractInstance.methods.animales(i).call();
        animalesData[i] = animal;
      }
      setAnimales(animalesData);

      setLoading(false);
    }

    loadBlockchainData();
  }, []);

  async function registrarAnimal() {
    try {
      await contract.methods.registrarAnimal(idAnimal, nombreAnimal, razaAnimal, fechaNacimientoAnimal).send({ from: account });
      // Actualizar el estado o recargar los datos después de registrar el animal
    } catch (error) {
      console.error(error);
      // Manejar el error aquí
    }
  }

  async function transferirPropiedad() {
    if (!idAnimalTransferir || !nuevoPropietario) {
      Swal.fire({
        icon: 'warning',
        title: 'Campos vacíos',
        text: 'Por favor, completa todos los campos para transferir la propiedad del animal.',
      });
      return;
    }
    try {
      await contract.methods.transferirPropiedad(idAnimalTransferir, nuevoPropietario).send({ from: account });
      // Actualizar el estado o recargar los datos después de transferir la propiedad
    } catch (error) {
      console.error(error);
      // Manejar el error aquí
    }
  }

  async function obtenerHistorial() {
    try {
      const historial = await contract.methods.obtenerHistorial(idAnimal).call();
      setHistorial(historial);
    } catch (error) {
      console.error(error);
      // Manejar el error aquí
    }
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>Registrar Nuevo Animal</h2>
      <div>
        <label>ID del Animal:</label>
        <input type="text" value={idAnimal} onChange={(e) => setIdAnimal(e.target.value)} />
      </div>
      <button onClick={registrarAnimal}>Registrar Animal</button>

      <h2>Transferir Propiedad de Animal</h2>
      <div>
        <label>ID del Animal a Transferir:</label>
        <input type="text" value={idAnimalTransferir} onChange={(e) => setIdAnimalTransferir(e.target.value)} />
      </div>
      <div>
        <label>Nuevo Propietario:</label>
        <input type="text" value={nuevoPropietario} onChange={(e) => setNuevoPropietario(e.target.value)} />
      </div>
      <button onClick={transferirPropiedad}>Transferir Propiedad</button>

      <h2>Obtener Historial de un Animal</h2>
      <div>
        <label>ID del Animal:</label>
        <input type="text" value={idAnimal} onChange={(e) => setIdAnimal(e.target.value)} />
        <button onClick={obtenerHistorial}>Obtener Historial</button>
      </div>
      {historial.length > 0 && (
        <div>
          <h3>Historial del Animal</h3>
          <ul>
            {historial.map((propietario, index) => (
              <li key={index}>{propietario}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default TrazabilidadGanaderia;
