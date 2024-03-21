const ChemiCoin = artifacts.require("ChemiCoin");

module.exports = function(deployer) {
  deployer.deploy(ChemiCoin, 'PigCoin','PIG','0x14d9Cb08D9EC82248f80ce136321e9cbDc4A51a2');
};
