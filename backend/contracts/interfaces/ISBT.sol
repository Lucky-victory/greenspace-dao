// SPDX-License-Identifier: MIT

pragma solidity 0.8.16;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

/**
 * @title IERC4671
 * @dev Interface implementation for {https://eips.ethereum.org/EIPS/eip-4671}
 */
interface ISBT is IERC721 {
    function getTokenIdOfOwner(address owner) external view returns (uint256);
}
