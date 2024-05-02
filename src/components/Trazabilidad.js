import React, { Component } from 'react';
import Web3 from 'web3';
import Swal from 'sweetalert2';
import trazabilidad from '../abis/trazabilidad.json'; // Asegúrate de importar el ABI correcto

class TrazabilidadGanaderia extends Component {
  state = {
    totalAnimales: 0,
    animales: {},
    loading: true,
    idAnimal: '', // Añade el campo para el ID del animal
    nombreAnimal: '',
    razaAnimal: '',
    fechaNacimientoAnimal: '',
    idAnimalTransferir: '',
    nuevoPropietario: '',
    contract: null,
    account: ''
  };

  async componentDidMount() {
    await this.loadWeb3();
    await this.loadBlockchainData();
  }

  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.request({ method: 'eth_requestAccounts' });
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
    } else {
      window.alert('¡Deberías considerar usar Metamask!');
    }
  }

  async loadBlockchainData() {
    const web3 = window.web3;
    const accounts = await web3.eth.getAccounts();
    this.setState({ account: accounts[0] });

    const networkId = await web3.eth.net.getId();
    const deployedNetwork = trazabilidad.networks[networkId];
    const contractInstance = new web3.eth.Contract(
      trazabilidad.abi,
      deployedNetwork && deployedNetwork.address,
    );
    this.setState({ contract: contractInstance });

    // Obtener el total de animales
    const totalAnimales = await contractInstance.methods.totalAnimales().call();
    this.setState({ totalAnimales: parseInt(totalAnimales) });

    // Cargar datos de animales
    for (let i = 1; i <= totalAnimales; i++) {
      const animal = await contractInstance.methods.animales(i).call();
      this.setState({
        animales: { ...this.state.animales, [i]: animal }
      });
    }

    this.setState({ loading: false });
  }

  // Método para registrar un nuevo animal
  registrarAnimal = async () => {
    const { idAnimal, nombreAnimal, razaAnimal, fechaNacimientoAnimal, contract, account } = this.state;
    try {
      await contract.methods.registrarAnimal(idAnimal, nombreAnimal, razaAnimal, fechaNacimientoAnimal).send({ from: account });
      // Actualizar el estado o recargar los datos después de registrar el animal
    } catch (error) {
      console.error(error);
      // Manejar el error aquí
    }
  };

  // Método para transferir la propiedad de un animal
  transferirPropiedad = async () => {
    const { idAnimalTransferir, nuevoPropietario, contract } = this.state;
    if (!idAnimalTransferir || !nuevoPropietario) {
      Swal.fire({
        icon: 'warning',
        title: 'Campos vacíos',
        text: 'Por favor, completa todos los campos para transferir la propiedad del animal.',
      });
      return;
    }
    try {
      await contract.methods.transferirPropiedad(idAnimalTransferir, nuevoPropietario).send({ from: this.state.account });
      // Actualizar el estado o recargar los datos después de transferir la propiedad
    } catch (error) {
      console.error(error);
      // Manejar el error aquí
    }
  };

  render() {
    if (this.state.loading) {
      return <div>Loading...</div>;
    }

    return (
      <div>
        <h2>Registrar Nuevo Animal</h2>
        <div>
          <label>ID del Animal:</label>
          <input type="text" value={this.state.idAnimal} onChange={(e) => this.setState({ idAnimal: e.target.value })} />
        </div>
        <div>
          <label>Nombre:</label>
          <input type="text" value={this.state.nombreAnimal} onChange={(e) => this.setState({ nombreAnimal: e.target.value })} />
        </div>
        <div>
          <label>Raza:</label>
          <input type="text" value={this.state.razaAnimal} onChange={(e) => this.setState({ razaAnimal: e.target.value })} />
        </div>
        <div>
          <label>Fecha de Nacimiento:</label>
          <input type="text" value={this.state.fechaNacimientoAnimal} onChange={(e) => this.setState({ fechaNacimientoAnimal: e.target.value })} />
        </div>
        <button onClick={this.registrarAnimal}>Registrar Animal</button>

        <h2>Transferir Propiedad de Animal</h2>
        <div>
          <label>ID del Animal a Transferir:</label>
          <input type="text" value={this.state.idAnimalTransferir} onChange={(e) => this.setState({ idAnimalTransferir: e.target.value })} />
        </div>
        <div>
          <label>Nuevo Propietario:</label>
          <input type="text" value={this.state.nuevoPropietario} onChange={(e) => this.setState({ nuevoPropietario: e.target.value })} />
        </div>
        <button onClick={this.transferirPropiedad}>Transferir Propiedad</button>
      </div>
    );
  }
}

export default TrazabilidadGanaderia;
