import React, { Component } from 'react';
import Web3 from 'web3';
import slotMachineABI from '../abis/SlotMachine.json';
import Swal from 'sweetalert2';
import reel1_1 from '../img/reel1_1.png';
import reel1_2 from '../img/reel1_2.png';
import reel2_1 from '../img/reel2_1.png';
import reel2_2 from '../img/reel2_2.png';
import reel3_1 from '../img/reel3_1.png';
import reel3_2 from '../img/reel3_2.png';

const payouts = {
    [reel1_1]: { 2: 5, 3: 10 },
    [reel1_2]: { 2: 5, 3: 10 },
    [reel2_1]: { 3: 20 },
    [reel2_2]: { 3: 20 },
    [reel3_1]: { 3: 30 },
    [reel3_2]: { 3: 30 }
};

class SlotMachine extends Component {
  state = {
    account: '',
    contract: null,
    loading: true,
    userBalance: 0,
    spinning: false,
    result: '',
    winnings: 0,
    reels: [
      [reel1_1, reel1_2, reel2_1], // Primer rodillo con reel1_1 y reel1_2
      [reel2_1, reel2_2,reel3_1], // Segundo rodillo con reel2_1 y reel2_2
      [reel3_1, reel3_2,reel2_2]  // Tercer rodillo con reel3_1 y reel3_2
    ],
    reelPositions: [0, 0, 0]
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
    const networkData = slotMachineABI.networks[networkId];
 
    if (networkData) {
      const abi = slotMachineABI.abi;
      const address = networkData.address;
      const contract = new web3.eth.Contract(abi, address);
      this.setState({ contract });
    } else {
      window.alert('¡El contrato no se ha desplegado en la red!')
    }
  }

  spinReels = async () => {
    if (this.state.spinning) return;
  
    try {
      this.setState({ spinning: true });
  
      const spinDuration = 3000; // Duración total del giro
      const spinInterval = 100; // Intervalo de tiempo entre cada spin
      const reels = this.state.reels;
      const newReelPositions = [...this.state.reelPositions];
  
      const spinTimers = reels.map((reel, index) => {
        const spins = Math.floor(Math.random() * 10) + 1; // Número aleatorio de spins entre 1 y 10
        let currentSpin = 0;
        return setInterval(() => {
          newReelPositions[index] = (newReelPositions[index] + 1) % reel.length;
          this.setState({ reelPositions: newReelPositions });
          currentSpin++;
          if (currentSpin >= spins * (spinDuration / (spins * spinInterval))) { // Detener el giro después de un número aleatorio de spins
            clearInterval(spinTimers[index]);
            if (index === reels.length - 1) {
              this.setState({ spinning: false });
              this.showSpinResult();
            }
          }
        }, spinInterval);
      });
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: 'error',
        title: 'Error al girar los carretes',
        text: err.message,
      });
      this.setState({ spinning: false });
    }
  }
  
  showSpinResult = () => {
    const spinResult = this.state.reels.map((reel, index) => reel[this.state.reelPositions[index]]);
    const winnings = this.calculateWinnings(spinResult);
    this.setState({ result: spinResult.join(' - '), winnings }); // Update the winnings state
  }
  

  calculateWinnings = (spinResult) => {
    let winnings = 0;
    const symbolCounts = {};
    spinResult.forEach(symbol => {
      symbolCounts[symbol] = (symbolCounts[symbol] || 0) + 1;
    });
    console.log('Symbol counts:', symbolCounts);
    for (const symbol in symbolCounts) {
      const count = symbolCounts[symbol];
      console.log('Symbol:', symbol, 'Count:', count);
      if (payouts[symbol] && payouts[symbol][count]) {
        console.log('Payout:', payouts[symbol][count]);
        winnings += payouts[symbol][count];
      } else if (count > 2) {
        // Si el recuento es mayor que 2, solo se cuenta como 2
        const maxPayoutCount = 2;
        if (payouts[symbol] && payouts[symbol][maxPayoutCount]) {
          console.log('Payout:', payouts[symbol][maxPayoutCount]);
          winnings += payouts[symbol][maxPayoutCount];
        }
      }
    }
    console.log('Total winnings:', winnings);
    return winnings;
  }
  
  
  

  render() {
    const { spinning, result, winnings } = this.state;
    const resultIndex = 0; // Define el índice que deseas mostrar aquí
    return (
      <div className="slot-machine">
        <div id="reels" style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
          {this.state.reels.map((reel, index) => (
            <div key={index} className="reel-container" style={{ marginRight: '20px' }}>
              <div className="reel" style={{ width: '100px', height: '150px', backgroundColor: '#f0f0f0', border: '1px solid #ccc', margin: '0 10px', display: 'inline-block', overflow: 'hidden', position: 'relative' }}>
                <img
                  src={reel[this.state.reelPositions[index]]}
                  alt={`Reel ${index + 1}`}
                  style={{
                    width: '100%',
                    height: 'auto',
                    display: 'block',
                    position: 'absolute',
                    top: spinning ? `-${150 * (this.state.reelPositions[index] + 1)}px` : 0,
                    left: 0,
                    transition: 'top 3s ease-in-out'
                  }}
                />
              </div>
            </div>
          ))}
        </div>
        <button id="spinButton" onClick={this.spinReels} disabled={spinning}>Spin</button>
        <div id="result">Result: {result.split(' - ')[resultIndex]}</div>
        <div>Winnings: {winnings}</div>
      </div>
    );
  }
}  
export default SlotMachine;
