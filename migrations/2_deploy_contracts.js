/*
 * @Author: Soingjeang
 * @Date: 2022-07-19 16:28:16
 * @LastEditors: SoingJeang
 * @LastEditTime: 2022-08-05 19:52:01
 * @FilePath: \CapTheEther\migrations\2_deploy_contracts.js
 */
const ethers = require('ethers')

const TokenBankChallenge = artifacts.require("TokenBankChallenge");
const CTFTokenBankChallenge = artifacts.require("CTFTokenBankChallenge");

module.exports = function(deployer) {
  // deployer.deploy(RetirementFundChallenge, "0x994F03e526ba7be8b8E8E8419ac5b662575f248b", {value:ethers.utils.parseEther('1.0')});
  deployer.deploy(TokenBankChallenge, "0x58f7beb6162ef4484b0a4539377ebcc17f4efa1c");
  deployer.deploy(CTFTokenBankChallenge);
};
