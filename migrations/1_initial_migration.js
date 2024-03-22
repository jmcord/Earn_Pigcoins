const ChemiCoin = artifacts.require("ChemiCoin");

module.exports = function(deployer) {
  deployer.deploy(ChemiCoin);
};