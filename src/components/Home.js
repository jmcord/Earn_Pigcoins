import React, { Component } from 'react';
import smart_contract from '../abis/ChemiCoin.json';
import Web3 from 'web3';
import Swal from 'sweetalert2';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import Navigation from './Navbar';
import MyCarousel from './Carousel';
import TokenList from './TokenList';
import { Container } from 'react-bootstrap';

class App extends Component {
  state = {
    account: '0x0',
    loading: true,
    contract: null,
    tokens: []
  }

  async componentDidMount() {
    await this.loadWeb3();
    await this.loadBlockchainData();
  }

  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.request({ method: 'eth_requestAccounts' });
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    } else {
      window.alert('¡Deberías considerar usar Metamask!')
    }
  }

  async loadBlockchainData() {
    const web3 = window.web3;
    const accounts = await web3.eth.getAccounts();
    this.setState({ account: accounts[0] });
    const networkId = await web3.eth.net.getId();
    const networkData = smart_contract.networks[networkId];

    if (networkData) {
      const abi = smart_contract.abi;
      const address = networkData.address;
      const contract = new web3.eth.Contract(abi, address);
      this.setState({ contract });

      const balanceTokensSC = await contract.methods.balanceTokensSC().call();
      const tokens = [{ name: 'ChemiCoin', symbol: 'CHC', address, balance: balanceTokensSC }];
      this.setState({ tokens });
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

  mintTokens = async (recipient, amount) => {
    try {
      await this.state.contract.methods.mint(recipient, amount).send({ from: this.state.account });
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

  render() {
    return (
      <div>
        <Navigation account={this.state.account} />
        <MyCarousel />
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 d-flex text-center">
              <div className="content mr-auto ml-auto">
                <h1>Gestión de los Tokens ERC-20</h1>
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
                <h3>Compra de Tokens ERC-20</h3>
                <form onSubmit={(event) => {
                  event.preventDefault();
                  const cantidad = this._numTokens.value;
                  this.compraTokens(cantidad);
                }}>
                  <input
                    type="number"
                    className="form-control mb-1"
                    placeholder="Cantidad de tokens a comprar"
                    ref={(input) => this._numTokens = input}
                  />
                  <input
                    type="submit"
                    className="btn btn-primary btn-sm"
                    value="COMPRAR TOKENS"
                  />
                </form>
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
