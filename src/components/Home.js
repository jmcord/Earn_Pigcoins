import React, { Component } from 'react';
import smart_contract_abi from '../abis/ChemiCoin.json';
import Web3 from 'web3';
import Swal from 'sweetalert2';

import Navigation from './Navbar';
import MyCarousel from './Carousel';
import TokenList from './TokenList';
import { Container } from 'react-bootstrap';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

const APY = 1000;

class App extends Component {
  state = {
    account: '0x0',
    loading: true,
    contract: null,
    tokens: [],
    userBalance: 0 // Nuevo estado para almacenar el saldo del usuario
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
    const networkData = smart_contract_abi.networks[networkId];
  
    if (networkData) {
      const abi = smart_contract_abi.abi;
      const address = networkData.address;
      const contract = new web3.eth.Contract(abi, address);
      this.setState({ contract });
  
      const balanceTokensSC = await contract.methods.balanceTokensSC().call();
      const tokens = [{ name: 'ChemiCoin', symbol: 'CHC', address, balance: balanceTokensSC }];
      this.setState({ tokens });
  
      const userBalance = await contract.methods.balanceOf(this.state.account).call();
      const userBalanceAdjusted = userBalance; // Divide por 10^18 para considerar los 18 decimales
      this.setState({ userBalance: userBalanceAdjusted }); // Actualiza el balance del usuario en el estado
    } else {
      window.alert('¡El Smart Contract no se ha desplegado en la red!')
    }
  }

  balanceTokensSC = async () => {
    try {
      const balanceTokensSC = await this.state.contract.methods.balanceTokensSC().call();
      Swal.fire({
        icon: 'info',
        title: 'Balance de tokens del Smart Contract:',
        width: 800,
        padding: '3em',
        text: `${balanceTokensSC} tokens`,
        backdrop: `rgba(15, 238, 168, 0.2) left top no-repeat`
      });
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: 'error',
        title: 'Error al obtener el balance de tokens del Smart Contract',
        text: err.message,
      });
    }
  }

  compraTokens = async (numTokens) => {
    try {
      const web3 = window.web3;
      const ethers = web3.utils.toWei(numTokens, 'ether');
      await this.state.contract.methods.buyTokens(numTokens).send({
        from: this.state.account,
        value: ethers * 0.01
      });
      Swal.fire({
        icon: 'success',
        title: '¡Compra de tokens realizada!',
        width: 800,
        padding: '3em',
        text: `Has comprado ${numTokens} token/s por un valor de ${ethers / 10 ** 18} ether/s`,
        backdrop: `rgba(15, 238, 168, 0.2) left top no-repeat`
      });
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: 'error',
        title: 'Error al realizar la compra de tokens',
        text: err.message,
      });
    }
  }

  stakeTokens = async (amount) => {
    try {
      const web3 = window.web3;
      const contract = this.state.contract;
      const accounts = await web3.eth.getAccounts();
      await contract.methods.stake(amount).send({ from: accounts[0] });
      Swal.fire({
        icon: 'success',
        title: '¡Stake de tokens realizado!',
        text: `Has staked ${amount} tokens.`,
      });
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: 'error',
        title: 'Error al realizar el stake de tokens',
        text: err.message,
      });
    }
  }

  mintTokens = async (recipient, amount) => {
    try {
      const web3 = window.web3;
      const contract = this.state.contract;
      const accounts = await web3.eth.getAccounts();
      const isOwner = await contract.methods.owner().call() === accounts[0]; // Verificar si la cuenta actual es propietaria
      if (!isOwner) {
        throw new Error('No tienes permisos para realizar esta acción.');
      }
      await contract.methods.mint(recipient, amount).send({ from: accounts[0] });
      Swal.fire({
        icon: 'success',
        title: '¡Minting de tokens realizado!',
        width: 800,
        padding: '3em',
        text: `Has minted ${amount} token/s para ${recipient}`,
        backdrop: `rgba(15, 238, 168, 0.2) left top no-repeat`
      });
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: 'error',
        title: 'Error al realizar el minting de tokens',
        text: err.message,
      });
    }
  }

  calculateReward = async () => {
    try {
      const web3 = window.web3;
      const contract = this.state.contract;
      const timeElapsed = (await web3.eth.getBlock('latest')).timestamp - (await contract.methods.lastRewardClaimTime(this.state.account).call());
      const reward = (await contract.methods.stakingBalance(this.state.account).call() * APY * timeElapsed) / (365 * 24 * 60 * 60 * 100); // APY * timeElapsed / 365 days
      return reward;
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: 'error',
        title: 'Error al calcular la recompensa',
        text: err.message,
      });
    }
  }

  withdrawReward = async () => {
    try {
      const web3 = window.web3;
      const contract = this.state.contract;
      const stakingBalance = await contract.methods.stakingBalance(this.state.account).call();
      if (stakingBalance <= 0) {
        throw new Error('No rewards to withdraw');
      }
      const lastRewardClaimTime = await contract.methods.lastRewardClaimTime(this.state.account).call();
      const blockNumber = await web3.eth.getBlockNumber();
      const block = await web3.eth.getBlock(blockNumber);
      const currentTime = block.timestamp;
      if (currentTime <= lastRewardClaimTime) {
        throw new Error('No rewards to withdraw');
      }
      const reward = await this.calculateReward();
      const rewardInteger = Math.floor(reward); // Convertir la recompensa a un número entero
      const rewardHex = web3.utils.toHex(rewardInteger); // Convertir a hex string
      await contract.methods.withdrawReward().send({ from: this.state.account });
      Swal.fire({
        icon: 'success',
        title: '¡Retiro de recompensa exitoso!',
        text: `Has retirado ${rewardInteger} tokens como recompensa.`,
      });
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: 'error',
        title: 'Error al retirar la recompensa',
        text: err.message,
      });
    }
  }
  
  

  render() {
    return (
      <div>
        <Navigation account={this.state.account} />
        <MyCarousel />
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 d-flex text-center">
              <div className="content mr-auto ml-auto">
                <h1>¡Gestiona, compra y stakea tus PigCoins!</h1>
                <h1>¡No te quedes sin los tuyos!</h1>
                <Container>
                  <Row>
                    <Col>
                      <h3>Tokens SC</h3>
                      <button
                        className="btn btn-info btn-sm"
                        onClick={this.balanceTokensSC}
                      >
                        Balance de Tokens (SC)
                      </button>
                    </Col>
                  </Row>
                </Container>
                <h3>Stake de Tokens</h3>
                <form onSubmit={(event) => {
                  event.preventDefault();
                  const amount = this._stakeAmount.value;
                  this.stakeTokens(amount);
                }}>
                  <input
                    type="number"
                    className="form-control mb-1"
                    placeholder="Cantidad de tokens a stakear"
                    ref={(input) => this._stakeAmount = input}
                  />
                  <input
                    type="submit"
                    className="btn btn-primary btn-sm"
                    value="Stake Tokens"
                  />
                </form>
                <h3>Compra de Tokens ERC-20</h3>
                <form onSubmit={(event) => {
                  event.preventDefault();
                  const cantidad = this._numTokens.value;
                  this.compraTokens(cantidad); //*10**18?
                }}>
                  <input
                    type="number"
                    className="form-control mb-1"
                    placeholder="Cantidad de tokens a comprar"
                    ref={(input) => (this._numTokens = input)}
                  />
                  <input
                    type="submit"
                    className="btn btn-primary btn-sm"
                    value="COMPRAR TOKENS"
                  />
                </form>

                <h3>Calcular Recompensa</h3>
                <button
                  className="btn btn-info btn-sm"
                  onClick={async () => {
                    const reward = await this.calculateReward();
                    Swal.fire({
                      icon: 'info',
                      title: 'Recompensa Calculada',
                      text: `La recompensa estimada es de ${reward} tokens.`,
                    });
                  }}
                >
                  Calcular Recompensa
                </button>

                <h3>Retirar Recompensa</h3>
                <button
                  className="btn btn-warning btn-sm"
                  onClick={this.withdrawReward}
                >
                  Retirar Recompensa
                </button>

                <h3>Mint Tokens</h3>
                <form onSubmit={(event) => {
                  event.preventDefault();
                  const recipient = this._recipient.value;
                  const amount = this._amount.value;
                  this.mintTokens(recipient, amount);
                }}>
                  <input
                    type="text"
                    className="form-control mb-1"
                    placeholder="Dirección del destinatario"
                    ref={(input) => this._recipient = input}
                  />
                  <input
                    type="number"
                    className="form-control mb-1"
                    placeholder="Cantidad de tokens a mintear"
                    ref={(input) => this._amount = input}
                  />
                  <input
                    type="submit"
                    className="btn btn-success btn-sm"
                    value="Mint Tokens"
                  />
                </form>
                <h3>Saldo del Usuario</h3>
                <p>{this.state.userBalance} tokens</p>
              </div>
            </main>
          </div>
        </div>
        <TokenList tokens={this.state.tokens} />
      </div>
    );
  }
}

export default App;
