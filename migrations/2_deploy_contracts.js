const ethers = require('ethers')

const CTFGuessTheNewNumber = artifacts.require("CTFGuessTheNewNumber");

module.exports = function(deployer) {
  deployer.deploy(CTFGuessTheNewNumber, {value:ethers.utils.parseEther("1.0")});
};
