// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Loteria is ERC721 {
    
    address public propietario;

    struct Usuario {
        uint256 idUsuario;
        uint256 numBoletos;
        uint256[] boletos;
        bool registrado;
    }

    mapping (address => Usuario) public participantes;
    mapping (address => bool) public registro;
    mapping (uint256 => address) public boletosAsignados;
    uint256 public tokenIdCounter;

    event Compra(address indexed comprador, uint256 cantidad);
    event Registro(address indexed aspirante);
    event saldoRetirado();
    event Ganador(uint256 boletoGanador, address ganador);

    modifier soloPropietario {
    require(msg.sender == propietario, "No tienes permisos");
    _;
    }

    constructor() ERC721("Boletos", "CHE") {
        tokenIdCounter = 1;
        propietario = msg.sender;
    }

    function registrarUsuario() public {
        require(!participantes[msg.sender].registrado, "Ya estas registrado");
        participantes[msg.sender].idUsuario = tokenIdCounter;
        participantes[msg.sender].registrado = true;
        participantes[msg.sender].numBoletos = 0;
        emit Registro(msg.sender);
    }

    function comprarBoletos(uint256 _cantidad) public payable {
        require(participantes[msg.sender].registrado, "No estas registrado");
        uint256 coste = _cantidad * 1 ether;
        require(msg.value >= coste, "No tienes saldo suficiente");
        
        for (uint256 i = 0; i < _cantidad; i++) {
            uint256 nuevoTokenId = tokenIdCounter++;
            participantes[msg.sender].numBoletos++;
            participantes[msg.sender].boletos.push(nuevoTokenId);
            boletosAsignados[nuevoTokenId];
            _mint(msg.sender, nuevoTokenId);
        }
        
        emit Compra(msg.sender, _cantidad);
    }

    function balanceDeSC() public view returns(uint256){
        return address(this).balance;
    }

    function balanceDeUsuario(address _user) public view returns(uint256){
        require(participantes[_user].registrado, "Usuario no registrado");
        return participantes[_user].numBoletos;
    }

    function withdraw(uint256 _amount) external soloPropietario{
        _amount = balanceDeSC();
        payable(msg.sender).transfer(_amount);

        emit saldoRetirado();
    }

    function generarBoletoGanador() public view soloPropietario returns (uint256) {
        uint256[] memory boletos = new uint256[](tokenIdCounter);
        for (uint256 i = 0; i < tokenIdCounter; i++) {
            boletos[i] = i + 1;
        }

        // Generar un número aleatorio utilizando el hash de la semilla
        uint256 seed = uint256(keccak256(abi.encodePacked(blockhash(block.number - 1), block.timestamp, msg.sender)));
        uint256 indiceGanador = seed % tokenIdCounter;

        return boletos[indiceGanador];
    }

    function localizarGanador() public soloPropietario returns(address) {
        uint256 boletoGanador = generarBoletoGanador();
        address ganador = boletosAsignados[boletoGanador];
        emit Ganador(boletoGanador, ganador);
        return(ganador);
    }

    function premiarGanador() public payable soloPropietario{
        uint256 _monto = address(this).balance;
        address ganador = localizarGanador();
        payable(ganador).transfer(_monto*1/2);
        payable(msg.sender).transfer(_monto*1/2);
    }

}