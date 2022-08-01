/*
 * @Author: Soingjeang
 * @Date: 2022-07-21 14:49:07
 * @LastEditors: SoingJeang
 * @LastEditTime: 2022-08-01 16:11:46
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
const ctfaddress = "0x15bDa7d67D7cA0e288D6f871f7D55d732670112b" // fill
const contractChallangeAddress = "0x32b0c9020A63d17AEaE9d25d12bb6F41d24eeDd0" // fill
const localChallange = "" //fill
const localctf = "0x95d4881c150678Af330F395A5831B9387da74b94" //fill

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

    // comp = await contractChallenge.isComplete()
    comp= false
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
        console.log(tranInfo)
        
        r = tranInfo.r
        s = tranInfo.s
        v = tranInfo.v
        let data = tranInfo.data

        const expandedSig = {
            r: r,
            s: s,
            v: v
           }
        const signature = ethers.utils.joinSignature(expandedSig)
           
        const txOriginData = {
            gasPrice: tranInfo.gasPrice,
            gasLimit: tranInfo.gasLimit,
            value: tranInfo.value,
            nonce: tranInfo.nonce,
            data: data,
            chainId: tranInfo.chainId,
            to: tranInfo.to
        }
        const rsTx = await ethers.utils.resolveProperties(txOriginData)
        const rawTx = ethers.utils.serializeTransaction(rsTx)
        const msgHash = ethers.utils.keccak256(rawTx)
        const msgBytes = ethers.utils.arrayify(msgHash)
        console.log("hash: " + msgHash)
        // uses ethers to decode
        const recoveredPubKey = ethers.utils.recoverPublicKey(msgBytes, signature)
        const recoveredAddress = ethers.utils.recoverAddress(msgBytes, signature)
        const newv = (v - 14).toString(10).toLowerCase()
        console.log("public: " + recoveredPubKey)
        console.log("Addr_call: " + recoveredAddress)
        const keccakPublic = '0x' + recoveredPubKey.slice(4)
        calcAddr = await contractCtf.calcPublicAddress(keccakPublic)
        console.log("Addr_chec: " + calcAddr)
        // r = '0xa5522718c0f95dde27f0827f55de836342ceda594d20458523dd71a539d52ad7'
        // s = '0x5710e64311d481764b5ae8ca691b05d14054782c7d489f3511a7abf2f5078962'
        // v = 41
        // msgHash = '0xd5059040fa47641a3388e7a6795eaaee42a96c6335189dd807075208adcb149a'
        var pubAddr = await contractCtf.doRecover(msgHash, r.valueOf(), s.valueOf(), newv.valueOf())
        console.log(pubAddr)

        await contractChallenge.authenticate(keccakPublic)
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

// 0x04613a8d23bd34f7e568ef4eb1f68058e77620e40079e88f705dfb258d7a06a1a0364dbe56cab53faf26137bec044efd0b07eec8703ba4a31c588d9d94c35c8db4
// 0x  613a8d23bd34f7e568ef4eb1f68058e77620e40079e88f705dfb258d7a06a1a0364dbe56cab53faf26137bec044efd0b07eec8703ba4a31c588d9d94c35c8db4