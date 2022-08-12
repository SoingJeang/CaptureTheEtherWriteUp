pragma solidity ^0.4.21;

contract StotageTest {
    uint256     value1;
    uint256[2]  value2;
    uint256     value3;
    uint32      value4;
    uint32      value5;
    uint64      value6;
    uint128     value7;

    function store() public {
        value4 = 1;
        value5 = 22;
        value6 = 333;
        value7 = 4444;

        uint96 value8 = value6 + uint32(666);
    }
}
