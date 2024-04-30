import React, { Component } from 'react';
import LotteryContract from '../abis/Loteria.json';
import Web3 from 'web3';
import Swal from 'sweetalert2';

import Navigation from './Navbar';
import MyCarousel from './Carousel';
import { Container, Row, Col, Button } from 'react-bootstrap';

class Loteria extends Component {
  state = {
    account: '0x0',
    loading: true,
    contract: null,
  }

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
    const networkData = LotteryContract.networks[networkId];
  
    if (networkData) {
      const abi = LotteryContract.abi;
      const address = networkData.address;
      const contract = new web3.eth.Contract(abi, address);
      this.setState({ contract });
    } else {
      window.alert('¡El contrato no se ha desplegado en la red!')
    }
  }

  registerUser = async () => {
    try {
      const contract = this.state.contract;
      await contract.methods.registrarUsuario().send({ from: this.state.account });
      Swal.fire({
        icon: 'success',
        title: '¡Registro exitoso!',
        text: 'Has sido registrado en la lotería.',
      });
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: 'error',
        title: 'Error al registrar usuario',
        text: err.message,
      });
    }
  }

  buyTicket = async () => {
    try {
      const contract = this.state.contract;
      await contract.methods.comprarBoletos(1).send({ from: this.state.account, value: 1 * 10 ** 18 }); // Compra de un boleto por 1 ETH
      Swal.fire({
        icon: 'success',
        title: '¡Compra de boleto exitosa!',
        text: 'Has comprado un boleto para participar en la lotería.',
      });
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: 'error',
        title: 'Error al comprar boleto',
        text: err.message,
      });
    }
  }

  generateWinner = async () => {
    try {
      const contract = this.state.contract;
      await contract.methods.localizarGanador().send({ from: this.state.account });
      Swal.fire({
        icon: 'success',
        title: '¡Ganador generado!',
        text: 'Se ha generado el ganador de la lotería.',
      });
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: 'error',
        title: 'Error al generar ganador',
        text: err.message,
      });
    }
  }

  rewardWinner = async () => {
    try {
      const contract = this.state.contract;
      await contract.methods.premiarGanador().send({ from: this.state.account });
      Swal.fire({
        icon: 'success',
        title: '¡Premio entregado!',
        text: 'El ganador ha recibido su premio.',
      });
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: 'error',
        title: 'Error al premiar ganador',
        text: err.message,
      });
    }
  }

  render() {
    return (
      <div>
        <Navigation account={this.state.account} />
        <MyCarousel />
        <Container className="mt-5">
          <Row className="justify-content-center">
            <Col md="auto">
              <h1>Gestiona tu participación en la lotería</h1>
              <Button variant="primary" onClick={this.registerUser}>Registro</Button>{' '}
              <Button variant="primary" onClick={this.buyTicket}>Comprar Boleto</Button>{' '}
              <Button variant="primary" onClick={this.generateWinner}>Generar Ganador</Button>{' '}
              <Button variant="primary" onClick={this.rewardWinner}>Premiar Ganador</Button>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default Loteria;
