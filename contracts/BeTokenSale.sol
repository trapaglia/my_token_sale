// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "./BeToken.sol";

contract BeTokenSale {
    address admin;
    BeToken public tokenContract;
    uint256 public tokenPrice;

    constructor(BeToken _tokenContract, uint256 _tokenPrice) public {
        admin = msg.sender;
        tokenContract = _tokenContract;
        tokenPrice = _tokenPrice;
    }
}
