/*
 * @Author: Soingjeang
 * @Date: 2022-07-21 14:49:07
 * @LastEditors: SoingJeang
 * @LastEditTime: 2022-07-28 17:55:03
 * @FilePath: \CapTheEther\src\accounts\4_2_PublicKeyChallenge.js
 */
const ethers = require('ethers');
const fs = require('fs');
const utils = require('../utils')
const abiFile = './build/contracts/PublicKeyChallenge.json'; // fill
const ctfAbi = './build/contracts/PublicKeyChallenge.json'; // fill
const secrteFile = "../.secret"
const mnemonicFile = "../iBpnG3uuUwI.csv"
const ctfaddress = "" // fill
const contractChallangeAddress = "" // fill
const localChallange = "" //fill
const localctf = "" //fill

var localtest = 0  //fill

let provider = utils.getNetProvider("3", localtest)


async function guess(contractCtf, contractChallenge) {
    publicKey = '0x8cc226315d6da1ff8c0ff5d7f50fe057d8200429f89cab52c57d51094bd3a67216ce70c341c95f7bc7b765b38d9de53fe805a9fa4c76a4e6fb5f4dd5bc79b6e9'
    viaAddr = '0x180172eC423ab0d93E946bAa2D0e3F31D6e386B2'
    address = ethers.keccak256(publicKey)
    console.log(address)

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