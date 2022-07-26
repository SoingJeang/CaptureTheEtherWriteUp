/*
 * @Author: Soingjeang
 * @Date: 2022-07-19 16:28:16
 * @LastEditors: SoingJeang
 * @LastEditTime: 2022-07-26 20:25:35
 * @FilePath: \CapTheEther\migrations\2_deploy_contracts.js
 */
const ethers = require('ethers')

const FiftyYearsChallenge = artifacts.require("FiftyYearsChallenge");
const CTFFiftyYearsChallenge = artifacts.require("CTFFiftyYearsChallenge");
// const CTFRetirementFundChallenge = artifacts.require("CTFRetirementFundChallenge");

module.exports = function(deployer) {
  // deployer.deploy(RetirementFundChallenge, "0x994F03e526ba7be8b8E8E8419ac5b662575f248b", {value:ethers.utils.parseEther('1.0')});
  deployer.deploy(FiftyYearsChallenge, "0x8491cF503Dc1C6F0c7375fB6DC7e9A3402AdB430", {value:ethers.utils.parseEther("1.0")});
  deployer.deploy(CTFFiftyYearsChallenge);
  
};
