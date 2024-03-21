const erc20_token = artifacts.require("erc20_token");

module.exports = function(deployer) {
  deployer.deploy(erc20_token);
};
