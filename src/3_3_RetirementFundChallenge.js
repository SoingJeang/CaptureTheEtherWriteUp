/*
 * @Author: Soingjeang
 * @Date: 2022-07-22 14:52:29
 * @LastEditors: SoingJeang
 * @LastEditTime: 2022-07-22 15:40:11
 * @FilePath: \CapTheEther\src\3_3_RetirementFundChallenge.js
 */
const ethers = require('ethers');
const fs = require('fs');
const utils = require('./utils')
const abiFile = './build/contracts/RetirementFundChallenge.json'; // fill
const ctfAbi = './build/contracts/RetirementFundChallenge.json'; // fill
const secrteFile = "../.secret"
const mnemonicFile = "../iBpnG3uuUwI.csv"
const ctfaddress = "0xC94246B73C3703A1351d8680012396629603E7ab" // fill
const contractChallangeAddress = "0xC94246B73C3703A1351d8680012396629603E7ab" // fill

let provider = utils.getNetProvider("3")


async function guess(contractCtf, contractChallenge) {

    var comp = await contractChallenge.isComplete()
    console.log("complete: " + comp)

    if(!comp) {
        var n = 1
        while(n < 18){
            await contractChallenge.withdraw({gasLimit:10000000})
            console.log("collectPenalty: " + n)
            await utils.sleep(10)
            n++
        }
    }
    
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