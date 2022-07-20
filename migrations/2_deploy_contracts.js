const ethers = require('ethers')

const CTFGuessTheNewNumber = artifacts.require("CTFGuessTheNewNumber");
const GuessTheNewNumberChallenge = artifacts.require("GuessTheNewNumberChallenge");

module.exports = function(deployer) {
  deployer.deploy(GuessTheNewNumberChallenge, {value:ethers.utils.parseEther('1.0')});
  deployer.deploy(CTFGuessTheNewNumber);
};
