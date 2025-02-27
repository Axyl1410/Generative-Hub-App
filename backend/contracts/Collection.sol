// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract Collection is ERC721URIStorage, Ownable {
    uint256 private _tokenIds;
    string public collectionName;
    string public collectionDescription;
    address public creator;
    string public collectionImageURL;
    string public blockchainType; // Biến mới

    event NFTMinted(uint256 indexed tokenId, address indexed owner, string tokenURI);
    event CollectionOwnershipTransferred(address indexed oldOwner, address indexed newOwner);

    constructor(
        string memory _name,
        string memory _symbol,
        string memory _description,
        string memory _imageURL,
        string memory _blockchainType  // Thêm tham số cho loại blockchain
    ) ERC721(_name, _symbol) Ownable(msg.sender) {
        collectionName = _name;
        collectionDescription = _description;
        collectionImageURL = _imageURL;
        creator = msg.sender;
        blockchainType = _blockchainType;  // Gán giá trị
    }

    modifier onlyCreator() {
        require(msg.sender == creator, "Only collection owner can mint");
        _;
    }

    function mintNFT(string memory tokenURI) public onlyCreator returns (uint256) {
        _tokenIds++;
        uint256 newItemId = _tokenIds;

        _mint(msg.sender, newItemId);
        _setTokenURI(newItemId, tokenURI);

        emit NFTMinted(newItemId, msg.sender, tokenURI);
        return newItemId;
    }

    function transferCollectionOwnership(address newOwner) public onlyCreator {
        require(newOwner != address(0), "New owner cannot be zero address");
        require(newOwner != creator, "New owner must be different");

        address oldOwner = creator;
        creator = newOwner;

        emit CollectionOwnershipTransferred(oldOwner, newOwner);
    }

    function getCollectionInfo() public view returns (string memory, string memory, string memory, string memory, address) {
        // Thêm blockchainType vào thông tin trả về
        return (collectionName, collectionDescription, collectionImageURL, blockchainType, creator);
    }
}
