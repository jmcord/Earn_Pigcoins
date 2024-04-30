// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SlotMachine {
    mapping(address => uint256) public winnings;

    function spin() external {
        // Lógica de juego - se puede implementar aquí o llamar a una función en el frontend
        // Actualmente, esta función no hace nada relacionado con el juego
    }

    function withdraw() external {
        uint256 amount = winnings[msg.sender];
        require(amount > 0, "No winnings to withdraw");
        winnings[msg.sender] = 0;
        payable(msg.sender).transfer(amount);
    }
}
