// SPDX-License-Identifier: MIT 
pragma solidity ^0.8.4; 

import "@openzeppelin/contracts/token/ERC721/ERC721.sol"; 
import "@openzeppelin/contracts/access/Ownable.sol"; 

contract MyNFT is ERC721, Ownable { 
    address public initialOwner;
    uint256 public constant maxTokensPerImage = 10; 
    uint256 public constant totalImages = 4; 
    uint256 public constant tokenPrice = 1 ether; 
    mapping(uint256 => uint256) private tokensSoldPerImage; 
    mapping(uint256 => string) private imageIPFSLinks; 
    
    constructor() ERC721("MyNFT", "MNFT"){
        initialOwner = msg.sender;
    }
    
    function mint(uint256 _imageId) external payable { 
        require(_imageId < totalImages, "Invalid image ID"); 
        require(tokensSoldPerImage[_imageId] < maxTokensPerImage, "All tokens for this image are sold out"); 
        require(msg.value >= tokenPrice, "Insufficient payment"); 
        _mint(msg.sender, _getNextTokenId(_imageId)); 
        tokensSoldPerImage[_imageId]++; 
        if (msg.value > tokenPrice) { 
            payable(msg.sender).transfer(msg.value - tokenPrice); // Refund excess payment 
        } 
    }

    function setImageIPFSLink(uint256 _imageId, string memory _ipfsLink) external onlyOwner { 
        require(_imageId < totalImages, "Invalid image ID"); 
        imageIPFSLinks[_imageId] = _ipfsLink; 
    } 
    
    function getImageIPFSLink(uint256 _imageId) external view returns (string memory) { 
        require(_imageId < totalImages, "Invalid image ID"); 
        return imageIPFSLinks[_imageId]; 
    } 
    
    function _getNextTokenId(uint256 _imageId) private view returns (uint256) { 
        return _imageId * maxTokensPerImage + tokensSoldPerImage[_imageId] + 1; 
    } 
    
    function withdraw() external onlyOwner { 
        uint256 balance = address(this).balance; 
        payable(owner()).transfer(balance); 
    } 
}
