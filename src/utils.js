const ethers = require('ethers');
const fs = require('fs');
// const BigNumber = require('BigNumber')
const menCount = "0xc160349854efcc1a7b6a55fc4b8df866a06d808d2a80fab80d71c421f743851b"
const otherCount = "0x1eb142ab35a0bf7ec1bc655e6a7629bdd06db3353517466cc3403097764521d7"

function getNetWork(netId) {
    let infuraKey = fs.readFileSync("../.infuraKey").toString().trim();
    let net = 'https://ropsten.infura.io/v3/' + infuraKey

    if(netId == "3") {
        return net
    }

    switch (netId) {
        case "1":
            net = 'https://mainnet.infura.io/v3/' + infuraKey
            break;

        case "3":
            net = 'https://ropsten.infura.io/v3/' + infuraKey
            break;

        case "4":
            net = 'https://rinkeby.infura.io/v3/' + infuraKey
            break;

        case "5":
            net = 'https://goerli.infura.io/v3/' + infuraKey
            break;

        case "42":
            net = 'https://kovan.infura.io/v3/' + infuraKey
            break;
        default:
            net = 'http://127.0.0.1:9545/'
            break;
    }

    return net;
}

function getString(priKeyPath) {
    const privKeyFile = fs.readFileSync(priKeyPath).toString().trim()
    const privKey = '0x' + new Buffer.from(privKeyFile);
    return privKey
}

function getNetProvider(netId, localtest) {
    var network
    if (localtest) {
        network = getNetWork("localtest")
    }
    else {
        network = getNetWork(netId)
    }
    return new ethers.providers.JsonRpcProvider(network)
}

function getContract(wallet, abiFile, contractAddress, provider) {
    wallet = wallet.connect(provider)

    var abiStr = fs.readFileSync(abiFile)
    var abiJson = JSON.parse(abiStr)
    var abi = abiJson["abi"]

    return new ethers.Contract(contractAddress, abi, wallet)
}

function getMnemonicWallet(mnemonicFile, localtest) {
    if (localtest) {
        return new ethers.Wallet(menCount)
    } else {
        let walletPath = {
            "standard": "m/44'/60'/0'/0/0",
        
            // @TODO: Include some non-standard wallet paths
        };
    
        let mnemonic = fs.readFileSync(mnemonicFile).toString().trim()
        // let hdnode = ethers.HDNode.fromMnemonic(mnemonic)
        // let node = hdnode.derivePath(walletPath.standard)
    
        // return new ethers.Wallet(node.privateKey)
        let secondMnemonicWallet = ethers.Wallet.fromMnemonic(mnemonic, walletPath.standard)
        return secondMnemonicWallet
    }
}

function getPriKeyWallet(srcretFile, localtest) {
    if (localtest) {
        return new ethers.Wallet(otherCount)
    }
    else {
        var privateKey = getString(srcretFile)
        return new ethers.Wallet(privateKey)
    }
}

function getWalletFromPriKey(prikey) {
    return new ethers.Wallet(prikey)
}

function getAbiValue(abiFile, valueName) {
    var abiStr = fs.readFileSync(abiFile)
    var abiJson = JSON.parse(abiStr)
    var abi = abiJson[valueName]

    return abi
}

async function getBalance(wallet) {
    let balancePromise = wallet.getBalance()
    balancePromise.then((balance) => {
        amount = ethers.utils.formatEther(balance)
        console.log(amount)
    })
}

async function sendEther(wallet, value, to, network_id) {
    let amount = ethers.utils.parseEther(value)
    // let tx = {
    //     to: to,
    //     value: amount
    // }
    // let sendPromise = wallet.sendTransaction(tx)
    // sendPromise.then((tx) => {
    //     console.log(tx);
    // })
    let provider = wallet.provider
    provider.getGasPrice().then((gasePrice) => {
        let transaction = {
            nonce: 0,
            gasLimit: 21000,
            gasPrice: gasePrice,
            to: to,
            value: amount,
            chainId: network_id
        }
        
        provider.sendTransaction(transaction).then((tx) => {
            console.log(tx)
        })
    })

   
    // let signPromise = wallet.signMessage(transaction)
//     signPromise.then((signedTransaction) => {
        
//     })
// }
}

async function deployAnContract(wallet, abis, byteCodes, contractname) {
    let factory = new ethers.ContractFactory(abis, byteCodes, wallet)
    // let factory = new ethers.getContractFactory('./build/contracts/CTFFuzzyIdentityChallenge.json')
    let contract = await factory.deploy({gasLimit:1000000})
    await contract.deployed()
    return contract
}

async function sleep(ms){
    return new Promise(resolve=>{
        setTimeout(resolve,ms)
    })
}

async function attachToContract(wallet, abi, contractaddress) {

}

module.exports = {
    getNetProvider,
    getContract,
    getMnemonicWallet,
    getPriKeyWallet,
    getWalletFromPriKey,
    getAbiValue,
    getBalance,
    sendEther,
    deployAnContract,
    attachToContract,
    sleep
}