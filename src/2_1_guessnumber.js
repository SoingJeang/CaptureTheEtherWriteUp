const ethers = require('ethers');
const fs = require('fs');
const utils = require('./utils')
const abiFile = './build/contracts/GuessTheNumberChallenge.json';
const secrteFile = "../.secret"
const mnemonicFile = "../iBpnG3uuUwI.csv"
const contractAddress = "0xE6b820dB7C08AB894b3E3197706609213AA22dfF"

let provider = utils.getNetProvider("3")


async function guess(contract) {
    let tx = await contract.guess(42, {value:ethers.utils.parseEther("1.0")})
    console.log("uess me success")
}

async function doValue() {

    let wallet = utils.getPriKeyWallet(secrteFile)

    let contract = utils.getContract(wallet, abiFile, contractAddress, provider)

    // console.log(contract)
    await guess(contract)
}


doValue()