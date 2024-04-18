const PigCoin = artifacts.require("PigCoin");
const MyNFT = artifacts.require("MyNFT");

module.exports = function(deployer) {
  deployer.deploy(PigCoin);
  deployer.deploy(MyNFT);
};