/*
 * @Author: Soingjeang
 * @Date: 2022-07-21 14:49:07
 * @LastEditors: SoingJeang
 * @LastEditTime: 2022-07-28 19:04:23
 * @FilePath: \CapTheEther\src\accounts\4_2_PublicKeyChallenge.js
 */
const ethers = require('ethers');
const generate = require("ethjs-account").generate;
const fs = require('fs');
const utils = require('../utils')
const abiFile = './build/contracts/PublicKeyChallenge.json'; // fill
const ctfAbi = './build/contracts/CTFPublicKeyChallenge.json'; // fill
const secrteFile = "../.secret"
const mnemonicFile = "../iBpnG3uuUwI.csv"
const ctfaddress = "0x8467B2F569aA737a485471f74C8fBEa21Cb9eC35" // fill
const contractChallangeAddress = "0x32b0c9020A63d17AEaE9d25d12bb6F41d24eeDd0" // fill
const localChallange = "" //fill
const localctf = "" //fill

var localtest = 0  //fill

let provider = utils.getNetProvider("3", localtest)


async function guess(contractCtf, contractChallenge) {
    seed='892h@fs8sk^2hSFR*/8s8shfs.jk39hsoi@hohskd51D1Q8E1%^;DZ1-=.@WWRXNI()VF6/*Z%$C51D1QV*<>FE8RG!FI;"./+-*!DQ39hsoi@hoFE1F5^7E%&*QS'//生成地址所用的种子

    addressOri = "0x92b28647ae1f3264661f72fb2eb9625a89d88a31"
    addressTmp = "0x92b28647ae1f3264661f72fb2eb9625a89d88a31"

    transactionHash = "0xabc467bedd1d17462fcc7942d0af7874d6f8bdefee2b299c9168a216d3ff0edb"
    // 签名 [0:64] + 27
    var r = ""
    // 签名 [64:128]
    var s = ""
    // 签名 [128:130]
    var v = ""

    comp = await contractChallenge.isComplete()
    console.log("complete: " + comp)
    if (!comp) {
        // for (var i=0; i < 1000000; i++) {
        //     seed = seed + Math.random().toString(36).substring(12);
        //     for(var j=0; j < 1000; j++) {
        //         res = generate(seed)
        //         buf = ethers.utils.keccak256(res.publicKey)
        //         addressTmp = '0x' + buf.slice(26).toString('hex');
        //         if (addressTmp == addressOri) {
        //             console.log('public: ' + res.publicKey)
        //             break
        //         }
        //     }
        // }
        
        let tranInfo = await provider.getTransaction(transactionHash)
        
        r = tranInfo.r
        s = tranInfo.s
        v = tranInfo.v
        data = tranInfo.data

        console.log("r: " + r + "s: " + s + "v: " + v)
        var pubAddr = contractCtf.doRecover(data, v + 27, r, s)
        
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