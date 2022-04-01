// SPDX-License-Identifier: MIT
pragma solidity ^0.8.3;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

import "hardhat/console.sol";

contract NFT is ERC721URIStorage {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenId;
    address contractAddress;

    string public collectionName;
    string public collectionSymbol;

    struct nftItem {
        uint256 tokenId;
        address  owner;
        string tokenUri;
    }

    mapping(uint256 => nftItem) public idToNFTItems;

    constructor(address marketplaceAddress) ERC721("Thinkrs NFT", "THINK") {
        contractAddress = marketplaceAddress;
        collectionName = name();
        collectionSymbol = symbol();
    }

    function createNFT(string memory tokenUri) public returns (uint) {
        uint256 newItemId = _tokenId.current();

        _mint(msg.sender, newItemId);
        _setTokenURI(newItemId, tokenUri);
        setApprovalForAll(contractAddress, true);

        idToNFTItems[newItemId] = nftItem(newItemId, msg.sender, tokenUri);

        _tokenId.increment();
        
        return newItemId;
    }

    function transferNFT(address from, address to, uint256 tokenId) external {
        require(ownerOf(tokenId) == from, "From address must be token owner");
        _transfer(from, to, tokenId);
    }
}