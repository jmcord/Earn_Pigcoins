import React, { Component } from 'react';
import Web3 from 'web3';
import Swal from 'sweetalert2';
import trazabilidad from '../abis/trazabilidad.json';

import Navigation from './Navbar';
import MyCarousel from './Carousel';

class TrazabilidadGanaderia extends Component {
  state = {
    totalAnimales: 0,
    animales: {},
    loading: true,
    idAnimal: '',
    nombreAnimal: '',
    razaAnimal: '',
    fechaNacimientoAnimal: '',
    idAnimalTransferir: '',
    nuevoPropietario: '',
    historial: [],
    contract: null,
    account: '',
  };

  async componentDidMount() {
    await this.loadBlockchainData();
  }

  async loadBlockchainData() {
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
    this.setState({ account: accounts[0] });

    const networkId = await web3.eth.net.getId();
    const deployedNetwork = trazabilidad.networks[networkId];
    const contractInstance = new web3.eth.Contract(trazabilidad.abi, deployedNetwork && deployedNetwork.address);
    this.setState({ contract: contractInstance });

    const totalAnimales = await contractInstance.methods.totalAnimales().call();
    this.setState({ totalAnimales: parseInt(totalAnimales) });

    const animalesData = {};
    for (let i = 1; i <= totalAnimales; i++) {
      const animal = await contractInstance.methods.animales(i).call();
      animalesData[i] = animal;
    }
    this.setState({ animales: animalesData, loading: false });
  }

  async registrarAnimal() {
    const { contract, idAnimal, nombreAnimal, razaAnimal, fechaNacimientoAnimal, account } = this.state;
    try {
      await contract.methods.registrarAnimal(idAnimal, nombreAnimal, razaAnimal, fechaNacimientoAnimal).send({ from: account });
      Swal.fire({
        icon: 'success',
        title: '¡Animal registrado correctamente!',
      });
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: 'error',
        title: 'Error al registrar el animal',
        text: error.message,
      });
    }
  }

  async transferirPropiedad() {
    const { idAnimalTransferir, nuevoPropietario, account, contract } = this.state;
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
      Swal.fire({
        icon: 'success',
        title: '¡Propiedad del animal transferida correctamente!',
      });
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: 'error',
        title: 'Error al transferir la propiedad del animal',
        text: error.message,
      });
    }
  }

  async obtenerHistorial() {
    const { idAnimal, contract } = this.state;
    try {
      const historial = await contract.methods.obtenerHistorial(idAnimal).call();
      this.setState({ historial });
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: 'error',
        title: 'Error al obtener el historial del animal',
        text: error.message,
      });
    }
  }

  render() {
    const { loading, idAnimal, nombreAnimal, razaAnimal, fechaNacimientoAnimal, idAnimalTransferir, nuevoPropietario, historial } = this.state;
    if (loading) {
      return <div>Loading...</div>;
    }

    return (
      <div>
        <Navigation account={this.state.account} />
        <MyCarousel />
        <div>
          <h2>Registrar Nuevo Animal</h2>
          <div>
            <label>ID del Animal:</label>
            <input type="text" value={idAnimal} onChange={(e) => this.setState({ idAnimal: e.target.value })} />
          </div>
          <div>
            <label>Nombre del Animal:</label>
            <input type="text" value={nombreAnimal} onChange={(e) => this.setState({ nombreAnimal: e.target.value })} />
          </div>
          <div>
            <label>Raza del Animal:</label>
            <input type="text" value={razaAnimal} onChange={(e) => this.setState({ razaAnimal: e.target.value })} />
          </div>
          <div>
            <label>Fecha de Nacimiento del Animal:</label>
            <input type="date" value={fechaNacimientoAnimal} onChange={(e) => this.setState({ fechaNacimientoAnimal: e.target.value })} />
          </div>
          <button onClick={() => this.registrarAnimal()}>Registrar Animal</button>

          <h2>Transferir Propiedad de Animal</h2>
          <div>
            <label>ID del Animal a Transferir:</label>
            <input type="text" value={idAnimalTransferir} onChange={(e) => this.setState({ idAnimalTransferir: e.target.value })} />
          </div>
          <div>
            <label>Nuevo Propietario:</label>
            <input type="text" value={nuevoPropietario} onChange={(e) => this.setState({ nuevoPropietario: e.target.value })} />
          </div>
          <button onClick={() => this.transferirPropiedad()}>Transferir Propiedad</button>

          <h2>Obtener Historial de un Animal</h2>
          <div>
            <label>ID del Animal:</label>
            <input type="text" value={idAnimal} onChange={(e) => this.setState({ idAnimal: e.target.value })} />
            <button onClick={() => this.obtenerHistorial()}>Obtener Historial</button>
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
      </div>
    );
  }
}

export default TrazabilidadGanaderia;
