import React, { Component } from 'react';

class TokenList extends Component {
  render() {
    const { tokens } = this.props;

    return (
      <div>
        <h3>Lista de Tokens</h3>
        <ul>
          {tokens.map((token, index) => (
            <li key={index}>
              <strong>Nombre:</strong> {'PigCoin'}, 
              <strong> Símbolo:</strong> {'PIG'}, 
              <strong> Dirección:</strong> {token.address}, 
              <strong> Balance:</strong> {token.balance}
            </li>
          ))}
        </ul>
      </div>
    );
  }
}

export default TokenList;
