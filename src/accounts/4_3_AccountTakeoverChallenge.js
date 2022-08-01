/*
 * @Author: Soingjeang
 * @Date: 2022-07-21 14:49:07
 * @LastEditors: SoingJeang
 * @LastEditTime: 2022-08-01 16:42:09
 * @FilePath: \CapTheEther\src\accounts\4_3_AccountTakeoverChallenge.js
 */
const ethers = require('ethers');
const fs = require('fs');
const utils = require('../utils')
const abiFile = './build/contracts/AccountTakeoverChallenge.json'; // fill
const ctfAbi = './build/contracts/AccountTakeoverChallenge.json'; // fill
const secrteFile = "../.secret"
const mnemonicFile = "../iBpnG3uuUwI.csv"
const ctfaddress = "" // fill
const contractChallangeAddress = "0xCEc1399D0b4BA9543829134d22B94F6312886AAA" // fill
const localChallange = "" //fill
const localctf = "" //fill

var localtest = 0  //fill

let provider = utils.getNetProvider("3", localtest)


async function guess(contractCtf, contractChallenge) {
    // transactionHash = '0x5e447fd466ac50da8bafcc5cbf471d03206f7984102962e3d298a163e9fec7c3'
    transactionHash = '0xe6b94c8cb3c27b40fed56117b806fe5335bd692af5bbfe9c01fd37610f5343f2'
    let tranInfo = await provider.getTransaction(transactionHash)
        console.log(tranInfo)
        
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

// 椭圆曲线 出现 相同 r 破解方法, 
// 公式 s = k(-1) * (z + privKey（私钥） * r) mod p
// k 为随机数
// z 为消息散列值
// r 为 ECSDA 签名，生成自相同随机数k
// p 为 secp256k1 曲线的素数阶；初始 0xfffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141


// s1 = k(-1) * (z1 + privKey * r) mod p            -1
// s2 = k(-1) * (z2 + privKey * r) mod p            -2
// 移动k
// s1 * k = (z1 + privKey * r) mod p                -3
// s2 * k = (z2 + privKey * r) mod p                -4
// 合并 3、4
// (s1 - s2) * k = (z1 - z2) mod p                  -5                  
// k = (z1 - z2) * (s1 - s2)(-1) mod p              -6
// 全体公式均 摩 p -> 所以 (s1 - s2) 是 p的 逆元
// 这边使用 费马小定理计算 或者 拓展欧几里得算法 计算 得到 k， 由 3得
// s1 * k - z1 = (r * privKey) mod p                -7 
// 计算得到 私钥 
// privKey = ((s1 * k - z1) * r(-1)) mod p
// 可用 公式 4进行验证
// privKey = ((s2 * k - z2) * r(-1)) mod p