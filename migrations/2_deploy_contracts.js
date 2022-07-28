/*
 * @Author: Soingjeang
 * @Date: 2022-07-19 16:28:16
 * @LastEditors: SoingJeang
 * @LastEditTime: 2022-07-28 18:59:34
 * @FilePath: \CapTheEther\migrations\2_deploy_contracts.js
 */
const ethers = require('ethers')

const CTFPublicKeyChallenge = artifacts.require("CTFPublicKeyChallenge");
// const CTFRetirementFundChallenge = artifacts.require("CTFRetirementFundChallenge");

module.exports = function(deployer) {
  // deployer.deploy(RetirementFundChallenge, "0x994F03e526ba7be8b8E8E8419ac5b662575f248b", {value:ethers.utils.parseEther('1.0')});
  deployer.deploy(CTFPublicKeyChallenge);
};
