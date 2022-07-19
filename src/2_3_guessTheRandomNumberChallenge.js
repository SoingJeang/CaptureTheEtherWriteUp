const ethers = require('ethers');
const fs = require('fs');
const utils = require('./utils')
const abiFile = './build/contracts/GuessTheRandomNumberChallenge.json';
const secrteFile = "../.secret"
const mnemonicFile = "../iBpnG3uuUwI.csv"
const contractAddress = "0xa8B393E813313A362Fc5f60AA8aa9043C9D13e95"

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

    let wallet = utils.getPriKeyWallet(secrteFile)

    let contract = utils.getContract(wallet, abiFile, contractAddress, provider)

    // console.log(contract)
    await guess(contract)
}


doValue()