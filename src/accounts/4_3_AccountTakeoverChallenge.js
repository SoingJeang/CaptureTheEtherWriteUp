/*
 * @Author: Soingjeang
 * @Date: 2022-07-21 14:49:07
 * @LastEditors: SoingJeang
 * @LastEditTime: 2022-08-02 15:04:45
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
    const nomal = 1000000000
    last = b.mod(nomal)

    for (let index = ethers.BigNumber.from(0); index.lt(b.sub(nomal)); ) {
        temp = temp.mul(a.mul(nomal))
        temp = temp.mod(m)
        index = index.add(nomal) 
        
        // if (index.mod(10000000000) == 0) {
        //     console.log(index)
        //     console.log(b)
        // }
    }

    return temp
}

async function guess(contractCtf, contractChallenge) {
    // firstTranInfo = await provider.getTransaction(tranactions.first)
    // SecondTranInfo = await provider.getTransaction(tranactions.second)
    // r = ethers.BigNumber.from(firstTranInfo.r)
    

    // fristS = firstTranInfo.s
    // secondS = SecondTranInfo.s
    // firstZ = await getTranContentHash(firstTranInfo)
    // firstZ = ethers.BigNumber.from(firstZ)
    // secondZ = await getTranContentHash(SecondTranInfo)
    // secondZ = ethers.BigNumber.from(secondZ)
    r = "0x69a726edfb4b802cbf267d5fd1dabcea39d3d7b4bf62b9eeaeba387606167166"
    p = ethers.BigNumber.from("0xfffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141")
    fristS = "0x2bbd9c2a6285c2b43e728b17bda36a81653dd5f4612a2e0aefdb48043c5108de"
    secondS = "0x7724cedeb923f374bef4e05c97426a918123cc4fec7b07903839f12517e1b3c8"
    firstZ = "0x4f6a8370a435a27724bbc163419042d71b6dcbeb61c060cc6816cda93f57860c"
    secondZ = "0x350f3ee8007d817fbd7349c477507f923c4682b3e69bd1df5fbb93b39beb1e04"
    fristS = ethers.BigNumber.from(fristS)
    secondS = ethers.BigNumber.from(secondS)
    firstZ = ethers.BigNumber.from(firstZ)
    secondZ = ethers.BigNumber.from(secondZ)
    s = secondS.sub(fristS)
    z = secondZ.sub(firstZ)
    r = ethers.BigNumber.from(r)
    
    let inverS = utils.mulInverse(s,p)
    let inverR = utils.mulInverse(r,p)
    // let inverS = ethers.BigNumber.from(calInverS.x)
    // if (inverS < 0 ){
    //     inverS += p
    // }
    // let inverR = ethers.BigNumber.from(calInverR.x)
    // if (inverR < 0){
    //     inverR += p
    // }
    console.log("inverS: " + inverS + "  inverR: " + inverR)
    console.log(inverS)
    console.log(inverR)
    k = (z.mul(inverS)) 
    k = k.mod(p)
    console.log(k)

    temp = fristS.mul(k).mod(p)
    temp = temp.sub(firstZ)
    temp = temp.mul(r).mod(p)
    privKey = ((fristS * k - firstZ) * r) % p
    privKey = (((fristS.mul(k)).sub(firstZ)).mul(r)).mod(p)
    privKeyCheck = secondS.mul(k).sub(secondZ).mul(r).mod(p)
    console.log(privKey)
    console.log(privKeyCheck)
        
    console.log(" privKey: " + privKey + "  privKeyCheck: " + privKeyCheck)

    privKey = "0x614f5e36cd55ddab0947d1723693fef5456e5bee24738ba90bd33c0c6e68e269"
    walletPri = new ethers.Wallet(privKey)
    contractPri = utils.getContract(walletPri, abiFile, contractChallangeAddress, provider)
    await contractPri.authenticate()
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
// 0x614f5e36cd55ddab0947d1723693fef5456e5bee24738ba90bd33c0c6e68e269
// 0x973985b7581c9276cceb6ea6bdf7c76f010eb9f06c0e3f3cd62c36a201081234
// 0xc48d7c9bbfce69c9355dfe640736b575e48b2647018b22cd92b50a6a780f91a7
