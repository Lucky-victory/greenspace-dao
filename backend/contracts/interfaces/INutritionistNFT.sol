// SPDX-License-Identifier: MIT

pragma solidity 0.8.16;

import "./ISBT.sol";

/**
 * @title IERC4671
 * @dev Interface implementation for {https://eips.ethereum.org/EIPS/eip-4671}
 */
interface INutritionistNFT is ISBT {
    
    event MintNutritionistNFT(address nutritionist);

    event BurnNutritionistNFT(address member, uint256 tokenId);

    function mint(address nutritionist, string memory uri) external;

    function burn(address nutritionist, uint256 _tokenId) external;
}
