const ethers = require('ethers')

const CTFPredictTheBlockHashChallenge = artifacts.require("CTFPredictTheBlockHashChallenge");

module.exports = function(deployer) {
  //deployer.deploy(CTFPredictTheFuture, {value:ethers.utils.parseEther('1.0')});
  deployer.deploy(CTFPredictTheBlockHashChallenge);
};
