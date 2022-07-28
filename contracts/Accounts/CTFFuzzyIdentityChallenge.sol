
pragma solidity ^0.4.21;

interface IFuzzyIdentityChallenge {
    function authenticate() public;
}

contract CTFFuzzyIdentityChallenge {
    function name() external view returns (bytes32) {
        bytes32 name = bytes32("smarx");
        return name;
    }

    function attack(address _address) public {
        IFuzzyIdentityChallenge fuzzy = IFuzzyIdentityChallenge(_address);
        fuzzy.authenticate();
    }
}

0x90907ccbad0ee25e38defd6e54badc0de923ef57