/*
 * @Author: Soingjeang
 * @Date: 2022-07-18 19:43:51
 * @LastEditors: SoingJeang
 * @LastEditTime: 2022-07-25 18:54:17
 * @FilePath: \CapTheEther\src\lotteries\2_2_guessTheSecretNumber.js
 */
const ethers = require('ethers');
const fs = require('fs');
const utils = require('../utils')
// const {keccak256} = require('ethereumjs-util')
const abiFile = './build/contracts/GuessTheSecretNumberChallenge.json';
const secrteFile = "../.secret"
const mnemonicFile = "../iBpnG3uuUwI.csv"
const contractAddress = "0xa7F63c6f1A1f5cd5f9e415674FA9B59cb6061dFC" // modify by your address

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

    let wallet = utils.getMnemonicWallet(mnemonicFile)

    let contract = utils.getContract(wallet, abiFile, contractAddress, provider)

    // console.log(contract)
    await guess(contract)
}


doValue()