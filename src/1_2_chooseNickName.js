const ethers = require('ethers');
const fs = require('fs');
const utils = require('./utils')
const network_id = "3"
const abiFile = './build/contracts/CaptureTheEther.json';
const abiFileChangleFile = './build/contracts/NicknameChallenge.json';

const secrteFile = "../.secret"
const mnemonicFile = "../iBpnG3uuUwI.csv"
const contractAddress = "0x71c46Ed333C35e4E6c62D32dc7C8F00D125b4fee"
const contractChallengeAddress = "0x1a28e9c2b0029fC7aa99b6d9556939cb847bfc51"


async function setCaptureName(contract, nickName, address) {
    let nameByte32s = ethers.utils.formatBytes32String(nickName)
    let tx = await contract.setNickname(nameByte32s, { from: address })
    // let tx = await contract.isComplete()
    console.log(tx)
    console.log("set NickName success")
}

async function setChangeAddress(contract, address) {
    // let tx = await contract.NicknameChallenge()
    let tx = await contract.isComplete()
    console.log(tx)
    console.log("set address success")
}

async function doValue() {
    let provider = utils.getNetProvider("3")
    let wallet = utils.getPriKeyWallet(secrteFile)
    wallet = wallet.connect(provider)\challenges\lotteries\guess-the-random-number\
    // let transaction = {
    //     nonce: 0,
    //     gasLimit: 21000
    // }
    // wallet.sign(transaction)
    // let wallet = utils.getPriKeyWallet(secrteFile)
    // let contractCapture = utils.getContract(wallet, abiFile, contractAddress, provider)
    // await setCaptureName(contractCapture, "zhanghuanghuang", wallet.address)

    // await utils.getBalance(wallet)
    utils.sendEther(wallet, "1.0", "0x994F03e526ba7be8b8E8E8419ac5b662575f248b", "3")
    // let providerChallenge = utils.getNetProvider(network_id)
    // let contractChallenge = utils.getContract(wallet, abiFileChangleFile, contractChallengeAddress, providerChallenge)
    // await setChangeAddress(contractChallenge, wallet.address)
}

doValue()