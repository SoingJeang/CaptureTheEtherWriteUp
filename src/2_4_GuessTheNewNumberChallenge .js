const ethers = require('ethers');
const fs = require('fs');
const utils = require('./utils')
const abiFile = './build/contracts/GuessTheNewNumberChallenge.json';
const contractAddressCtf = "./build/contracts/CTFGuessTheNewNumber.json"
const secrteFile = "../.secret"
const mnemonicFile = "../iBpnG3uuUwI.csv"
const ctfContract = "0x882D0eC43e85dDbbCd874C2bB2337e3dB354B72c"
const contractAddress = "0x7D5eD887Da99EdfA37B34D8A8606cCFF3032B3eA"

let provider = utils.getNetProvider("3")

// use another contract because of can't caculate now by js
async function guess(contractCtf, contractChallange) {
    // get 256 bit at position
    var blockNum = await provider.getBlockNumber()
    // var blockhash = ethers.utils.keccak256([blockNum], now)
    console.log("pre block num: " + blockNum)

    // let craeateInstance = await contractCtf.setGuessMeAddress(contractAddress)
    // console.log("inout address success")
    // let tx = await contractCtf.doCapture({value:ethers.utils.parseEther("1.0")})
    let tx = await contractCtf.doCaptureByBlockNum(blockNum, {value:ethers.utils.parseEther("1")})
    console.log(tx)

    // let tc = await contractChallange.isComplete()
    // console.log(tc)
    

    // for (let index = 0; index < 2 ** 8; index++) {
    //     // let hash = ethers.utils.keccak256([index])
    //     if(blockNum == index) {
    //         // console.log("success")
    //         // console.log([index])
    //         // let tx = await contract.guess(index, {value:ethers.utils.parseEther("1.0")})
    //     }
    //     // console.log(hash)
    // }
    
    console.log("guess me success")
}

async function doValue() {

    let wallet = utils.getPriKeyWallet(secrteFile)

    let contract = utils.getContract(wallet, contractAddressCtf, ctfContract, provider)
    //let contractChallange = utils.getContract(wallet, abiFile, contractAddress, provider)
    contractChallange = 1

    // console.log(contract)
    await guess(contract, contractChallange)
}


doValue()