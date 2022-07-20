const ethers = require('ethers');
const fs = require('fs');
const utils = require('./utils')
const abiFile = './build/contracts/GuessTheNumberChallenge.json';
const ctfAbi = './build/contracts/CTFPredictTheFuture.json';
const secrteFile = "../.secret"
const mnemonicFile = "../iBpnG3uuUwI.csv"
const ctfaddress = "0xbA3f1733A2fA11349C24A47300AeF49935B4BF96"
const contractChallangeAddress = "0x546308a9429a0Fc75347BD9d7044B5436C3bA39E"

let provider = utils.getNetProvider("3")


async function guess(contract) {
    await contract.setAddress(contractChallangeAddress)
    console.log('set adddress success')
    let tx = await contract.preLockInGuess({value:ethers.utils.parseEther("1.0")})
    console.log('set num success')

    // 如果合约ctf合约失效重设为了不丢失对应的ether直接设置值
    // await contract.setLastGuess(0)
    // console.log('set last num success')
    
    var preBlock = 0;
    while (! await contract.hasComplete())  {
        var blockNum = await provider.getBlockNumber()
        if (blockNum > preBlock + 1) {
            var lastAnswer = await contract.lastAnswer()
            console.log("pre block num: " + blockNum + ";  lastAnswer: " + lastAnswer)
            console.log("guessinging !!!")
            // 必须再给 gas设置 否则 runout of gas
            await contract.guess({gasLimit: 2100000})
            console.log("guessing fail !")
            preBlock = blockNum;
        }
        // await sleep(1000)
    }

    await contract.withdraw()
    console.log("uess me success")
}

async function doValue() {

    let wallet = utils.getMnemonicWallet(mnemonicFile)

    let contract = utils.getContract(wallet, ctfAbi, ctfaddress, provider)

    // console.log(contract)
    
    guess(contract)
}

async function sleep(ms){
    return new Promise(resolve=>{
        setTimeout(resolve,ms)
    })
}


doValue()