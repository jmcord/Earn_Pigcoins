const ChemiCoin = artifacts.require("ChemiCoin");

module.exports = function(deployer) {
  const name = "PigCoin"; // Nombre del token
  const symbol = "PIG"; // Símbolo del token
  const initialOwner = "0x14d9Cb08D9EC82248f80ce136321e9cbDc4A51a2"; // Dirección del propietario inicial

  deployer.deploy(ChemiCoin);
};