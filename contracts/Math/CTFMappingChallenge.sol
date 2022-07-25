pragma solidity ^0.4.21;

contract CTFMappingChallenge {
    bool public isComplete;
    uint256[] map;

    function set(uint256 key, uint256 value) public {
        // Expand dynamic array as needed
        if (map.length <= key) {
            map.length = key + 1;
        }

        map[key] = value;
    }

    function get(uint256 key) public view returns (uint256) {
        return map[key];
    }

    function getSlot(uint _value) public view returns (uint256) {
        uint256 nArraybegin = uint256(keccak256(_value));
        uint256 nret = 2 ** 256 - 1;
        nret = nret - nArraybegin + 1;
        return nret;
    }
 }