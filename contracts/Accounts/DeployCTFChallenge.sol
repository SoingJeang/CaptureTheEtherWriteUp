pragma solidity ^0.4.21;

import "./CTFFuzzyIdentityChallenge.sol";

contract DeployCTFChallenge {
    // old 
    bytes byteCodeOri = hex"6060604052341561000f57600080fd5b6101908061001e6000396000f30060606040526004361061004c576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff16806306fdde0314610051578063d018db3e14610082575b600080fd5b341561005c57600080fd5b6100646100bb565b60405180826000191660001916815260200191505060405180910390f35b341561008d57600080fd5b6100b9600480803573ffffffffffffffffffffffffffffffffffffffff169060200190919050506100e8565b005b6000807f736d61727800000000000000000000000000000000000000000000000000000090508091505090565b60008190508073ffffffffffffffffffffffffffffffffffffffff1663380c7a676040518163ffffffff167c0100000000000000000000000000000000000000000000000000000000028152600401600060405180830381600087803b151561015057600080fd5b5af1151561015d57600080fd5b50505050505600a165627a7a7230582056cd841c75700a280507d297b00e5217fa34f362b13db7f07400606793591cc60029";
    address public addrCtf;
    
    // 需要 0.5.0以上
    function deployOld(bytes32 _salt) public {
        bytes memory byteCode = byteCodeOri;
        address addr;

        assembly {
            addr := create2(0, add(byteCode, 0x20), mload(byteCode), _salt)
        }

        // create2 produce address: keccak256(0xff ++ deployingAddr ++ salt ++ keccak256(bytecode))[12:]
        // addrCtf = addr;
    }

    // new must use more than 0.8.0
    function deployNew(bytes32 _salt) public returns (address) {
        // CTFFuzzyIdentityChallenge c = new CTFFuzzyIdentityChallenge{salt: _salt}();
        return address(0);
    }

    function compareCallAddr(address _address) public view returns(bool) {
        bool bEqual = _address == addrCtf;
        return bEqual;
    }

    function callCTFViaAddress(address _address, address _attackAddess) public {
        CTFFuzzyIdentityChallenge ctf = CTFFuzzyIdentityChallenge(_address);
        ctf.attack(_attackAddess);
    }

    function callCTF(address _attackAddess) public {
        CTFFuzzyIdentityChallenge ctf = CTFFuzzyIdentityChallenge(addrCtf);
        ctf.attack(_attackAddess);
    }
}