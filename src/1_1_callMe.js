const ethers = require('ethers');
const fs = require('fs');
const utils = require('./utils')
const abiFile = './build/contracts/CallMeChallenge.json';
const secrteFile = "../.secret"
const mnemonicFile = "../iBpnG3uuUwI.csv"
const contractAddress = "0xD0B84AFb6Be0F5b3aD5119e001683278d0461ac6"

let provider = utils.getNetProvider("3")


async function callMe(contract) {
    let tx = await contract.callme()
    console.log("call me success")
}

async function doValue() {
    // var privateKey = utils.getString("../.secret")
    // let wallet = new ethers.Wallet(privateKey, provider)

    // var abiStr = fs.readFileSync(abiFile)

    // // console.log(abiStr)
    // var abiJson = JSON.parse(abiStr)
    // var abi = abiJson["abi"]

    // let contract = new ethers.Contract(contractAddress, abi, wallet)
    let wallet = utils.getMnemonicWallet(mnemonicFile)

    let contract = utils.getContract(wallet, abiFile, contractAddress, provider)

    // console.log(contract)
    await callMe(contract)
}


doValue()