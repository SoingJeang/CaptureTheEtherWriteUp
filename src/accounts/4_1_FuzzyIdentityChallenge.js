/*
 * @Author: Soingjeang
 * @Date: 2022-07-21 14:49:07
 * @LastEditors: SoingJeang
 * @LastEditTime: 2022-07-28 17:44:23
 * @FilePath: \CapTheEther\src\accounts\4_1_FuzzyIdentityChallenge.js
 */
const ethers = require('ethers');
const ethutil = require("ethereumjs-util");
const rlp = require("rlp");
const generate = require("ethjs-account").generate;
const fs = require('fs');
const utils = require('../utils')
const abiFile = './build/contracts/FuzzyIdentityChallenge.json'; // fill
const ctfAbi = './build/contracts/CTFFuzzyIdentityChallenge.json'; // fill
const deployAbi = './build/contracts/DeployCTFChallenge.json';
const secrteFile = "../.secret"
const mnemonicFile = "../iBpnG3uuUwI.csv"
const ctfaddress = "0xFe6eBd7B9c98D8eCF8186257f6Bb3C376D1F8B2e" // fill
const contractChallangeAddress = "0x14b245FBccb32c735684b9752D77F2Ad52782F58" // fill
const deployAddress = "0x561a271967F88582B9541b8c51DA0583D4c04dB1"
const localdeployAddress = "0x10d4f9899a550d22dfeeAE3670963c0555DD9e13"
const localChallange = "0x42052Ec2b02A6AF7d184b84285Fe82672Ed698ce" //fill
const localctf = "0xf2B49A42fE6F04EA5535123349551BF07982dD07" //fill

seed='892h@fs8sk^2hSFR*/8s8shfs.jk39hsoi@hohskd51D1Q8E1%^;DZ1-=.@WWRXNI()VF6/*Z%$C51D1QV*<>FE8RG!FI;"./+-*!DQ39hsoi@hoFE1F5^7E%&*QS'//生成地址所用的种子
var localtest = 0  //fill

let provider = utils.getNetProvider("3", localtest)


// contract was genenrate by provider's address and nonce.so that's the key

async function guess(contractCtf, contractChallenge, contractDeploy) {
    var ctfabi = utils.getAbiValue(ctfAbi, "abi")
    var ctfbyteCode = utils.getAbiValue(ctfAbi, "bytecode")
    var ctfname = utils.getAbiValue(ctfAbi, "contractName")
    var ctfContAddress = "0x90907CCbAd0Ee25e38DeFd6E54Badc0de923eF57"

    var attack = 3  // 0=genetage; 1=set nonce; 2=deploy; 3=attack
    var ResP = {}
    var privateMain = '0xa7c10eba72bc2a8a61dee6be17f75b0116f98fdedfa2b2a1f640af2f89fb8857'
    var nonceMain = 4
    var wallet = utils.getWalletFromPriKey(privateMain)
    wallet = wallet.connect(provider)

    // 0=genetage;
    comp = await contractChallenge.isComplete()
    console.log("complete: " + comp)
    if (!comp) {
        if(attack == 0) {
            for (var i=0; i < 1000000; i++) {
                seed = seed + Math.random().toString(36).substring(12);
        
                for(var j=0; j < 1000; j++) {
                    res = generate(seed)
                    for (let k = 0; k < 10; k++) {
                        // 部署者的 地址
                        encodedRlp = rlp.encode([res.address, k])
                        buf = ethers.utils.keccak256(encodedRlp)
                        contractAddress = buf.slice(26).toString('hex');
                        contractAddress = '0x' + contractAddress
                        if(contractAddress.includes('badc0de')) {
                            ResP = res
                            privateMain = res.privateKey
                            nonceMain = k
                            console.log(contractAddress)

                            console.log(res);
                            console.log(k);
                            return;
                        }
                    }
                    
                }
            }
        }
        // 1=set nonce
        else if (attack == 1) {
            if (privateMain.length > 0) {
                for (let i = 0; i < nonceMain; i++) {
                    
                }
            }
        }
        // 2=deploy
        else if (attack == 2) {
            if (privateMain.length > 0) {
                contract = await utils.deployAnContract(wallet, ctfabi, ctfbyteCode, ctfname)
                console.log("new contract:" + contract.address)
                // ctfContAddress = contract.address
                // await contract.attack(contractChallangeAddress)
                // console.log("attack")
            }
        }
        // 3=attack
        else {
            contractctf = utils.getContract(wallet, ctfAbi, ctfContAddress, provider)
            await contractctf.attack(contractChallangeAddress)
            console.log("attack")
        }

        // if(saltResult.length > 0) {
        //     await contractDeploy.deployOld(saltResult, {gasLimit:1000000})
        //     console.log("deploy ctf")
        //     // await contractDeploy.callCTF(localChallange, {gasLimit:1000000})
        //     // console.log("call ctf")
        // }
    }

    console.log("uess me success")
}

async function doCapture() {

    let wallet = utils.getMnemonicWallet(mnemonicFile, localtest)

    var contractChall
    var contrateCtf
    var contractDeploy
    if (localtest) {
        contractChall = utils.getContract(wallet, abiFile, localChallange, provider)
        contrateCtf = utils.getContract(wallet, ctfAbi, localctf, provider)
        contractDeploy = utils.getContract(wallet, deployAbi, localdeployAddress, provider)
    }
    else {
        contractChall = utils.getContract(wallet, abiFile, contractChallangeAddress, provider)
        contrateCtf = utils.getContract(wallet, ctfAbi, ctfaddress, provider)
        contractDeploy = utils.getContract(wallet, deployAbi, deployAddress, provider)
    }
    
    guess(contrateCtf, contractChall, contractDeploy)
}

doCapture()