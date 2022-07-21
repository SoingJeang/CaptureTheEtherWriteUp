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

async function doValue() {

    let wallet = utils.getMnemonicWallet(mnemonicFile)

    let contractChall = utils.getContract(wallet, abiFile, contractChallangeAddress, provider)
    let contrateCtf = utils.getContract(wallet, ctfAbi, ctfaddress, provider)
    // console.log(contract)
    
    guess(contrateCtf, contract)
}

doCapture()