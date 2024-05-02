import React, { Component } from 'react';
import Web3 from 'web3';
import Swal from 'sweetalert2';

class TrazabilidadGanaderia extends Component {
  state = {
    totalAnimales: 0,
    animales: {},
    loading: true
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
    // Aquí deberías cargar los datos del contrato desde la blockchain
    // Por ejemplo, puedes cargar el número total de animales y la información de cada animal
    // Esto requerirá interacciones con el contrato inteligente TrazabilidadGanaderia
    // Una vez que tengas los datos, actualiza el estado del componente
    // Ejemplo: this.setState({ totalAnimales: totalAnimales, animales: animales });
  }

  // Función para registrar un nuevo animal
  registrarAnimal = async (nombre, raza, fechaNacimiento) => {
    try {
      const web3 = window.web3;
      const accounts = await web3.eth.getAccounts();
      // Aquí deberías interactuar con el contrato inteligente para registrar un nuevo animal
      // Por ejemplo, llamar a la función registrarAnimal del contrato
      // Esto requerirá enviar una transacción desde la cuenta del usuario
      // Después de registrar el animal, actualiza el estado del componente
      // Ejemplo: this.setState(prevState => ({ totalAnimales: prevState.totalAnimales + 1 }));
      Swal.fire({
        icon: 'success',
        title: 'Animal registrado',
        text: 'Se ha registrado un nuevo animal en la blockchain.',
      });
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: 'error',
        title: 'Error al registrar el animal',
        text: err.message,
      });
    }
  }

  // Función para transferir la propiedad de un animal
  transferirPropiedad = async (idAnimal, nuevoPropietario) => {
    try {
      const web3 = window.web3;
      const accounts = await web3.eth.getAccounts();
      // Aquí deberías interactuar con el contrato inteligente para transferir la propiedad del animal
      // Por ejemplo, llamar a la función transferirPropiedad del contrato
      // Esto requerirá enviar una transacción desde la cuenta del usuario
      // Después de transferir la propiedad, actualiza el estado del componente
      // Ejemplo: console.log('Propiedad transferida exitosamente.');
      Swal.fire({
        icon: 'success',
        title: 'Propiedad transferida',
        text: 'La propiedad del animal ha sido transferida correctamente.',
      });
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: 'error',
        title: 'Error al transferir la propiedad',
        text: err.message,
      });
    }
  }

  render() {
    return (
      <div>
        {/* Aquí puedes agregar tu interfaz de usuario para interactuar con el contrato */}
        {/* Por ejemplo, formularios para registrar un nuevo animal o transferir la propiedad */}
      </div>
    );
  }
}

export default TrazabilidadGanaderia;
