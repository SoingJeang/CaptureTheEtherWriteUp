const ethers = require('ethers');
const fs = require('fs');
const utils = require('./utils')
// const {keccak256} = require('ethereumjs-util')
const abiFile = './build/contracts/GuessTheSecretNumberChallenge.json';
const secrteFile = "../.secret"
const mnemonicFile = "../iBpnG3uuUwI.csv"
const contractAddress = "0x82e0f089954c0A021ab94BDF97cA2eba796D58ca" // modify by your address

let provider = utils.getNetProvider("3")


async function guess(contract) {
    var hashAnswer = "0xdb81b4d58595fbbbb592d3661a34cdca14d7ab379441400cbfa1b78bc447c365"
    for (let index = 0; index < 2 ** 8; index++) {
        let hash = ethers.utils.keccak256([index])
        if(hashAnswer === hash) {
            console.log("success")
            console.log([index])
            let tx = await contract.guess(index, {value:ethers.utils.parseEther("1.0")})
            console.log(tx)
        }
        // 
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