/*
 * @Author: Soingjeang
 * @Date: 2022-07-19 16:28:16
 * @LastEditors: SoingJeang
 * @LastEditTime: 2022-07-22 11:00:46
 * @FilePath: \CapTheEther\migrations\2_deploy_contracts.js
 */
const ethers = require('ethers')

const TokenWhaleChallenge = artifacts.require("TokenWhaleChallenge");

module.exports = function(deployer) {
  //deployer.deploy(CTFPredictTheFuture, {value:ethers.utils.parseEther('1.0')});
  deployer.deploy(TokenWhaleChallenge, "0x8491cF503Dc1C6F0c7375fB6DC7e9A3402AdB430");
};
