// SPDX-License-Identifier: MIT
pragma solidity ^0.8.3;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";

contract NFT1155 is ERC1155 {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenId;
    constructor(string memory uri) ERC1155(uri) {   
    }

    function createNFT(uint256 amount) public returns(uint) {
        uint id = _tokenId.current();
        _mint(msg.sender, id, amount, "");

        _tokenId.increment();

        return id;
    }
}
