/*
 * @Author: Soingjeang
 * @Date: 2022-07-22 14:52:29
 * @LastEditors: SoingJeang
 * @LastEditTime: 2022-07-25 18:56:31
 * @FilePath: \CapTheEther\src\math\3_3_RetirementFundChallenge.js
 */
const ethers = require('ethers');
const fs = require('fs');
const utils = require('../utils')
const abiFile = './build/contracts/RetirementFundChallenge.json'; // fill
const ctfAbi = './build/contracts/CTFRetirementFundChallenge.json'; // fill
const secrteFile = "../.secret"
const mnemonicFile = "../iBpnG3uuUwI.csv"
const ctfaddress = "0x83A175E8730e2729A1F5ac06c8F84925439a15FF" // fill
const contractChallangeAddress = "0x8Ed51f4555D6355ddc6f96a15aA5475eEe8AE103" // fill

let provider = utils.getNetProvider("3")


async function guess(contractCtf, contractChallenge) {

    var comp = await contractChallenge.isComplete()
    console.log("complete: " + comp)

    if(!comp) {
        // await contractCtf.attack(contractChallangeAddress, {value:ethers.utils.parseEther("1.0")})
        // console.log("uses attack")
        await contractChallenge.collectPenalty()
        console.log("collect my Penalty")
        await utils.sleep(5000)
    }

    comp = await contractChallenge.isComplete()
    console.log("complete: " + comp)
    
    console.log("uess me success")
}

async function doCapture() {

    let wallet = utils.getMnemonicWallet(mnemonicFile)

    let contractChall = utils.getContract(wallet, abiFile, contractChallangeAddress, provider)
    let contrateCtf = utils.getContract(wallet, ctfAbi, ctfaddress, provider)
    // console.log(contract)
    
    guess(contrateCtf, contractChall)
}

doCapture()