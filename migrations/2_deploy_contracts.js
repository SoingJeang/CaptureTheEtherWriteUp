const ethers = require('ethers')

const TokenSaleChallenge = artifacts.require("TokenSaleChallenge");

module.exports = function(deployer) {
  //deployer.deploy(CTFPredictTheFuture, {value:ethers.utils.parseEther('1.0')});
  deployer.deploy(TokenSaleChallenge, "0x01d086b0448da1e41090a4839740c0eb7a7b861e", {value:ethers.utils.parseEther('1.0')});
};
