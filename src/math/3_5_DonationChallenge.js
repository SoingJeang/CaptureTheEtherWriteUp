/*
 * @Author: Soingjeang
 * @Date: 2022-07-25 18:57:14
 * @LastEditors: SoingJeang
 * @LastEditTime: 2022-07-26 13:37:35
 * @FilePath: \CapTheEther\src\math\3_5_DonationChallenge.js
 */
/*
 * @Author: Soingjeang
 * @Date: 2022-07-21 14:49:07
 * @LastEditors: SoingJeang
 * @LastEditTime: 2022-07-26 11:04:15
 * @FilePath: \CapTheEther\src\captureModel.js
 */
const ethers = require('ethers');
const fs = require('fs');
const utils = require('../utils')
const abiFile = './build/contracts/DonationChallenge.json'; // fill
const ctfAbi = './build/contracts/DonationChallenge.json'; // fill
const secrteFile = "../.secret"
const mnemonicFile = "../iBpnG3uuUwI.csv"
const ctfaddress = "0xd43d82B5EE19261fDFdcB3c57720799f05a1EF08" // fill
const contractChallangeAddress = "0xaF49c1C70dA5fAEF1DB2eD63Af721d543Ef8C05A" // fill
const localChallange = "0x2C5A3137680B195e717D30A1001d5ABb7eD859c6" //fill
const localctf = "0x05D0faF7e1e30C76e0a175BECA000930dCB9f6a6" //fill

var localtest = 1  //fill

let provider = utils.getNetProvider("3", localtest)


async function guess(contractCtf, contractChallenge) {
    comp = await contractChallenge.isComplete()
    console.log("complete: " + comp)
    if (!comp) {
        let etherAmount = ethers.BigNumber.from(10)
        // etherAmount = etherAmount.pow(36)
        check = await contractCtf.checkDonate(etherAmount)

        console.log("set check: " + check)
        await utils.sleep(5000)
    }
    
    comp = await contractChallenge.isComplete()
    console.log("complete: " + comp)
    console.log("uess me done")
}

async function doCapture() {

    let wallet = utils.getMnemonicWallet(mnemonicFile, localtest)

    var contractChall
    var contrateCtf
    if (localtest) {
        contractChall = utils.getContract(wallet, abiFile, localChallange, provider)
        contrateCtf = utils.getContract(wallet, ctfAbi, localctf, provider)
    }
    else {
        contractChall = utils.getContract(wallet, abiFile, contractChallangeAddress, provider)
        contrateCtf = utils.getContract(wallet, ctfAbi, ctfaddress, provider)
    }
    
    // console.log(contract)
    
    guess(contrateCtf, contractChall)
}

doCapture()

