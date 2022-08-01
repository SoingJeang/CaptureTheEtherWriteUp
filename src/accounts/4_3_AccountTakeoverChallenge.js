/*
 * @Author: Soingjeang
 * @Date: 2022-07-21 14:49:07
 * @LastEditors: SoingJeang
 * @LastEditTime: 2022-08-01 18:27:58
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
const tranactions = {
    first: "0xd79fc80e7b787802602f3317b7fe67765c14a7d40c3e0dcb266e63657f881396",
    second: "0x061bf0b4b5fdb64ac475795e9bc5a3978f985919ce6747ce2cfbbcaccaf51009"
}

var localtest = 0  //fill

let provider = utils.getNetProvider("3", localtest)

async function getTranContentHash(tranInfo) {
    const txOriginData = {
        gasPrice: tranInfo.gasPrice,
        gasLimit: tranInfo.gasLimit,
        value: tranInfo.value,
        nonce: tranInfo.nonce,
        data: tranInfo.data,
        chainId: tranInfo.chainId,
        to: tranInfo.to
    }
    const rsTx = await ethers.utils.resolveProperties(txOriginData)
    const rawTx = ethers.utils.serializeTransaction(rsTx)
    const msgHash = ethers.utils.keccak256(rawTx)

    return msgHash
}

function bigNumberMulMod(a, b, m) {
    temp = a
    for (let index = 0; index < b - 1; index++) {
        temp = temp.add(a)
        temp = temp.mod(m)
    }

    return temp
}

async function guess(contractCtf, contractChallenge) {
    firstTranInfo = await provider.getTransaction(tranactions.first)
    SecondTranInfo = await provider.getTransaction(tranactions.second)
    r = ethers.BigNumber.from(firstTranInfo.r)
    p = ethers.BigNumber.from("0xfffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141")

    fristS = ethers.BigNumber.from(firstTranInfo.s)
    fristS = fristS.mod(p)
    secondS = ethers.BigNumber.from(SecondTranInfo.s)
    secondS = secondS.mod(p)
    firstZ = await getTranContentHash(firstTranInfo)
    firstZ = ethers.BigNumber.from(firstZ)
    secondZ = await getTranContentHash(SecondTranInfo)
    secondZ = ethers.BigNumber.from(secondZ)
    s = secondS.sub(fristS)
    z = secondZ.sub(firstZ)
    
    calInverS = utils.mulInverse(s,p)
    calInverR = utils.mulInverse(r,p)
    let inverS = calInverS.x
    if (inverS < 0 ){
        inverS += p
    }
    let inverR = calInverR.x
    if (inverR < 0){
        inverR += p
    }
    console.log("inverS: " + inverS + "  inverR: " + inverR)
    k = bigNumberMulMod(z, inverS, p)
    console.log(" net: " + k)
    while (k > p){
        k -= p
    }
    console.log(k)
    while (k < 0){
        k += p
    }
    console.log(k)
    
    var temp = fristS
    for (let index = 0; index < k - 1; index++) {
        temp = temp.add(fristS)
        temp = temp.mod(p) 
    }
    console.log(temp)
    privKeyCheck = ((secondS * k - secondZ) * r) % p
        
    console.log("k: " + k + " privKey: " + privKey + "  privKeyCheck: " + privKeyCheck)
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