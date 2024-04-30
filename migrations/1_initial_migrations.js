const PigCoin = artifacts.require("PigCoin");
const MyNFT = artifacts.require("MyNFT");
const loteria = artifacts.require("loteria");

module.exports = function(deployer) {
  deployer.deploy(PigCoin);
  deployer.deploy(MyNFT);
  deployer.deploy(loteria);
};