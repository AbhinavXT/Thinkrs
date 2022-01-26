// SPDX-License-Identifier: MIT OR Apache-2.0
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

    function getMyNFT() public view returns(nftItem[] memory) {
        uint totalItemCount = _tokenId.current();
        uint itemCount = 0;
        uint currentIndex = 0;

        for (uint i = 0; i < totalItemCount; i++) {
            if (idToNFTItems[i].owner == msg.sender) {
                itemCount += 1;
            }
        }

        nftItem[] memory items = new nftItem[](itemCount);

        for (uint i = 0; i < totalItemCount; i++) {
            if (idToNFTItems[i].owner == msg.sender) {
                uint currentId = i;
                nftItem storage currentItem = idToNFTItems[currentId];
                items[currentIndex] = currentItem;
                currentIndex += 1;
            }
        }

        return items;
    }
}