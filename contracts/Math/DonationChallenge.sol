pragma solidity ^0.4.21;

contract DonationChallenge {
    struct Donation {
        uint256 timestamp;
        uint256 etherAmount;
    }
    Donation[] public donations;

    address public owner;

    function DonationChallenge() public payable {
        require(msg.value == 1 ether);
        
        owner = msg.sender;
    }
    
    function isComplete() public view returns (bool) {
        return address(this).balance == 0;
    }

    function donate(uint256 etherAmount) public payable {
        // amount is in ether, but msg.value is in wei
        uint256 scale = 10**18 * 1 ether;
        require(msg.value == etherAmount / scale);

        Donation donation;
        donation.timestamp = now;
        donation.etherAmount = etherAmount;

        donations.push(donation);
    }

    function withdraw() public {
        require(msg.sender == owner);
        
        msg.sender.transfer(address(this).balance);
    }

    function checkDonate(uint256 etherAmount) public view returns(uint256) {
        uint256 scale = 10**18 * 1 ether;
        uint256 check = etherAmount / scale;
        return check;
    }

    function checkBalance() public view returns(uint256) {
        return address(this).balance;
    }

    function getOwner() public view returns(address){
        return owner;
    }
}
0x0000000000C097cE7bC90715B34b9F1000000000
0x0000000000C097cE7bC90715B34b9F1000000000
0x000000000785EE10d5da46d900f436a000000000
0xA867F103b2FffA5a71FBa0E7B680000000000000
0x6C3B15F9926687D2C40534Fdb564000000000000
0x01d086b0448da1e41090a4839740c0eb7a7b861e
10359278799252544203414344029953609218028963358
0xAF298D050e4395d69670B12B7F41000000000000
3552713678800500929355621337890625
56843418860808014869689941406250000