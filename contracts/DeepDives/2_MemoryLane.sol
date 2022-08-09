pragma solidity ^0.4.21;

/// @title MemoryLane
/// @dev explain someMemory
contract MemoryLane {
    uint256 number;

    /// @dev Alloc value
    function memoryLane() public pure {
        bytes32[5] memory a;
        bytes32[2] memory b;
        b[0] = bytes32(uint256(1));
    }
}