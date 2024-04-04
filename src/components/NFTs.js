import React, { Component, Button } from 'react';
import smart_contract_abi from '../abis/ChemiCoin.json';
import Web3 from 'web3';
import Swal from 'sweetalert2';


import Navigation from './Navbar';
import MyCarousel from './Carousel';
import TokenList from './TokenList';
import { Container } from 'react-bootstrap';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import MyNFTABI from '../abis/MyNFT.json'


const totalImages = 4;
const maxTokensPerImage = 10;
const tokenPrice = 1; // Precio en ether
const MyNFTAddress = '0x039722f39d68494DBB605a6AEED69FDA59d99460'; //Poner la dirección real cuando se despliegue


class NFTs extends Component {
    state = {
        account: '0x0',
        loading: true,
        contract: null,
        tokensSoldPerImage: [],
        imageIPFSLinks: []
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
    
        const MyNFT = new web3.eth.Contract(MyNFTABI, MyNFTAddress);
        this.setState({ contract: MyNFT });
    
        const tokensSoldPerImage = [];
        const imageIPFSLinks = [];
        for (let i = 0; i < totalImages; i++) {
          const tokensSold = await MyNFT.methods.tokensSoldPerImage(i).call();
          const ipfsLink = await MyNFT.methods.getImageIPFSLink(i).call();
          tokensSoldPerImage.push(tokensSold);
          imageIPFSLinks.push(ipfsLink);
        }
        this.setState({ tokensSoldPerImage, imageIPFSLinks });
      }
    
      mintToken = async (imageId) => {
        try {
          const web3 = window.web3;
          const MyNFT = this.state.contract;
          const tokensSold = this.state.tokensSoldPerImage[imageId];
          if (tokensSold >= maxTokensPerImage) {
            throw new Error('All tokens for this image are sold out');
          }
          await MyNFT.methods.mint(imageId).send({ from: this.state.account, value: web3.utils.toWei(tokenPrice.toString(), 'ether') });
          Swal.fire({
            icon: 'success',
            title: '¡Token minteado exitosamente!',
            text: '¡Has minteado un nuevo token de esta imagen!',
          });
        } catch (err) {
          console.error(err);
          Swal.fire({
            icon: 'error',
            title: 'Error al mintear el token',
            text: err.message,
          });
        }
      };
    
      render() {
        return (
          <div>
            {/* Tu componente Navigation aquí */}
            <Container>
              <Row>
                {Array.from({ length: totalImages }, (_, i) => (
                  <Col key={i} className="my-3">
                    <h3>Imagen {i + 1}</h3>
                    <p>Tokens vendidos: {this.state.tokensSoldPerImage[i]}</p>
                    <p>IPFS Link: {this.state.imageIPFSLinks[i]}</p>
                    <Button variant="primary" onClick={() => this.mintToken(i)}>
                      Mintear Token
                    </Button>
                  </Col>
                ))}
              </Row>
            </Container>
            {/* Otros componentes de tu aplicación */}
          </div>
        );
      }
    }
    
export default NFTs;