const ethers = require('ethers');
const fs = require('fs');
const utils = require('../utils')
const abiFile = './build/contracts/GuessTheRandomNumberChallenge.json';
const secrteFile = "../.secret"
const mnemonicFile = "../iBpnG3uuUwI.csv"
const contractAddress = "0xe9a6318cf6db9A88102A341c611E5D5F3B04A73F"

let provider = utils.getNetProvider("3")


async function guess(contract) {
    // get 256 bit at position
    var hashAnswer = await provider.getStorageAt(contract.address, 0)
    console.log(hashAnswer)
    
    for (let index = 0; index < 2 ** 8; index++) {
        // let hash = ethers.utils.keccak256([index])
        if(hashAnswer == index) {
            console.log("success")
            console.log([index])
            let tx = await contract.guess(index, {value:ethers.utils.parseEther("1.0")})
        }
        // console.log(hash)
    }
    
    console.log("guess me success")
}

async function doValue() {

    let wallet = utils.getMnemonicWallet(mnemonicFile)

    let contract = utils.getContract(wallet, abiFile, contractAddress, provider)

    // console.log(contract)
    await guess(contract)
}


doValue()