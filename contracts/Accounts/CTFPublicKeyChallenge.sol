pragma solidity ^0.4.21;

contract CTFPublicKeyChallenge {
    address public publicAddress;

    function doRecover(bytes32 _hash, bytes32 _r, bytes32 _s, uint8 _v) public pure returns(address){
        address calcAddr = ecrecover(_hash, _v, _r, _s);
        return calcAddr;
    }

    function doRecoverByAdd(bytes32 _hash, bytes32 _r, bytes32 _s, byte _v) public pure returns(address){
        uint8 newV = uint8(_v) + 27;
        address calcAddr = ecrecover(_hash, _v, _r, _s);
        return calcAddr;
    }
}