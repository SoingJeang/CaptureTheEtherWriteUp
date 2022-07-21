const ethers = require('ethers')

const CTFTokenSaleChallenge = artifacts.require("CTFTokenSaleChallenge");

module.exports = function(deployer) {
  //deployer.deploy(CTFPredictTheFuture, {value:ethers.utils.parseEther('1.0')});
  deployer.deploy(CTFTokenSaleChallenge);
};
