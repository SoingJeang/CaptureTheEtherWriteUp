pragma solidity ^0.4.21;

/// @title Storages
/// @dev store & retrieve value in a variable
contract Storages {
    uint256 number;

    /// @dev Store value in variable
    /// @param num value to store
    function store(uint256 num) public {
        number = num;
    }

    /// @dev  Return value
    /// @return value of number
    function retrieve() public view returns(uint256) {
        return number;
    }
}

pragma solidity ^0.4.21;

/// @title Storages
/// @dev store & retrieve value in a variable
contract Storages {
    uint256 number;

    /// @dev Store value in variable
    /// @param num value to store
    function store(uint256 num) public {
        number = num;
    }

    /// @dev  Return value
    /// @return value of number
    function retrieve() public view returns(uint256) {
        return number;
    }
}