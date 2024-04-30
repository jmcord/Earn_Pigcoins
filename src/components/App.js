import React, { Component } from 'react';
import { BrowserRouter, Route, Routes } from "react-router-dom";

import Home from './Home';
import Footer from './Footer';
import NFTs from './NFTs';
import Loteria from './Loteria';
import SlotMachine from './Slot';

class App extends Component {
    
    render() {
        return (
            <BrowserRouter>
                <div className="App">
                    <div>
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route exact path="/nfts" element={<NFTs />} />
                            <Route exact path="/loteria" element={<Loteria />} />
                            <Route exact path="/slot" element={<SlotMachine />} />
                        </Routes>
                    </div>
                    <Footer />
                </div>
            </BrowserRouter>
        );
    }

}

export default App;