/*
 * @Author: Soingjeang
 * @Date: 2022-07-22 14:52:29
 * @LastEditors: SoingJeang
 * @LastEditTime: 2022-07-22 14:59:25
 * @FilePath: \CapTheEther\src\3_3_RetirementFundChallenge.js
 */
const ethers = require('ethers');
const fs = require('fs');
const utils = require('./utils')
const abiFile = './build/contracts/.json'; // fill
const ctfAbi = './build/contracts/.json'; // fill
const secrteFile = "../.secret"
const mnemonicFile = "../iBpnG3uuUwI.csv"
const ctfaddress = "" // fill
const contractChallangeAddress = "" // fill

let provider = utils.getNetProvider("3")


async function guess(contractCtf, contractChallenge) {
    
    
    console.log("uess me success")
}

async function doCapture() {

    let wallet = utils.getMnemonicWallet(mnemonicFile)

    let contractChall = utils.getContract(wallet, abiFile, contractChallangeAddress, provider)
    let contrateCtf = utils.getContract(wallet, ctfAbi, ctfaddress, provider)
    // console.log(contract)
    
    guess(contrateCtf, contractChall)
}

doCapture()