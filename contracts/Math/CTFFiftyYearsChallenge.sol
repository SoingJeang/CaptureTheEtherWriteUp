pragma solidity ^0.4.21;

contract CTFFiftyYearsChallenge {
    function CTFFiftyYearsChallenge() public {

    }

    function getTimaStampAfter(uint256 _nyear, uint256 _nday) public view returns(uint256){
        uint256 nYear = uint256(1 years) * _nyear;
        uint256 nDay = uint256(1 days) * _nday;
        return uint256(now) + nYear + nDay;
    }

    function getTS() public view returns(uint256){
        return uint256(50 years + 1 days);
    }

    function getTSAfter(uint256 _nyear, uint256 _nday) public view returns(uint256){
        uint256 nYear = uint256(1 years) * _nyear;
        uint256 nDay = uint256(1 days) * _nday;
        return nYear + nDay;
    }

    function getMaxuint256() public view returns(uint256){
        return 2**256 - 1;
    }

    function getMaxTimeStamp(uint256 _nyear, uint256 _nday) public view returns(uint256){
        uint256 nYear = uint256(1 years) * _nyear;
        uint256 nDay = uint256(1 days) * _nday;
        uint256 nret = 2**256 - 1;
        nret = nret - nYear - nDay + 1;
        return nret;
    }
}