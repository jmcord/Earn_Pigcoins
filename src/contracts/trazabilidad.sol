// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

contract trazabilidad {
    // Estructura para representar un animal
    struct Animal {
        uint id;
        string nombre;
        string raza;
        string fechaNacimiento;
        address propietarioActual;
        address[] historialPropietarios;
    }
    
    // Mapeo de ID de animal a su información
    mapping(uint => Animal) public animales;
    uint public totalAnimales;

    // Evento que se emite cuando un animal cambia de propietario
    event TransferenciaPropiedad(uint indexed idAnimal, address indexed propietarioAnterior, address indexed nuevoPropietario);

    // Función para registrar un nuevo animal
    function registrarAnimal(string memory _nombre, string memory _raza, string memory _fechaNacimiento) public {
        totalAnimales++;
        animales[totalAnimales] = Animal(totalAnimales, _nombre, _raza, _fechaNacimiento, msg.sender, new address[](0));
    }

    // Función para transferir la propiedad de un animal
    function transferirPropiedad(uint _idAnimal, address _nuevoPropietario) public {
        require(msg.sender == animales[_idAnimal].propietarioActual, "No eres el propietario actual de este animal");
        animales[_idAnimal].propietarioActual = _nuevoPropietario;
        animales[_idAnimal].historialPropietarios.push(msg.sender);
        emit TransferenciaPropiedad(_idAnimal, msg.sender, _nuevoPropietario);
    }
}
