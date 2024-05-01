// SPDX-License-Identifier: MIT

pragma solidity 0.8.16;

import "./ISBT.sol";

/**
 * @title IERC4671
 * @dev Interface implementation for {https://eips.ethereum.org/EIPS/eip-4671}
 */
interface IUserNFT is ISBT {

  event MintUserNFT(address member);

  event BurnUserNFT(address member, uint256 tokenId);

  function mint(address member, string memory uri) external;

  function burn(address member, uint256 _tokenId) external;

}
