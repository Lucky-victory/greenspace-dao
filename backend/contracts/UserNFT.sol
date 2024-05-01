// SPDX-License-Identifier: MIT

pragma solidity 0.8.16;

import "./interfaces/IUserNFT.sol";
import {SBT} from "./SBT.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract UserNFT is IUserNFT, SBT {
    using Strings for uint256;

    using Counters for Counters.Counter;

    // Optional mapping for token URIs
    mapping(uint256 => string) private _tokenURIs;

    Counters.Counter private tokenUriIds;

    address public owner;

    constructor(
        string memory name,
        string memory symbol,
        address _owner
    ) SBT(name, symbol) {
        owner = _owner;
    }

    // FUNCTIONS
    function mint(address nutritionist, string memory uri) external override {
        require(msg.sender == owner, "caller not owner");
        _mintUsingAutomaticTokenId(nutritionist);
        tokenUriIds.increment();
        uint256 tokenUriId = tokenUriIds.current();

        _setTokenURI(tokenUriId, uri);

        emit MintUserNFT(nutritionist);
    }

    function burn(address nutritionist, uint256 _tokenId) external override {
        require(msg.sender == owner, "caller not owner");
        _burn(nutritionist, _tokenId);

        if (bytes(_tokenURIs[_tokenId]).length != 0) {
            delete _tokenURIs[_tokenId];
        }

        emit BurnUserNFT(nutritionist, _tokenId);
    }

    /**
     * @dev See {IERC721Metadata-tokenURI}.
     */
    function tokenURI(
        uint256 tokenId
    ) public view virtual override returns (string memory) {
        _requireMinted(tokenId);

        string memory _tokenURI = _tokenURIs[tokenId];
        string memory base = _baseURI();

        // If there is no base URI, return the token URI.
        if (bytes(base).length == 0) {
            return _tokenURI;
        }
        // If both are set, concatenate the baseURI and tokenURI (via abi.encodePacked).
        if (bytes(_tokenURI).length > 0) {
            return string(abi.encodePacked(base, _tokenURI));
        }

        return super.tokenURI(tokenId);
    }

    /**
     * @dev Sets `_tokenURI` as the tokenURI of `tokenId`.
     *
     * Requirements:
     *
     * - `tokenId` must exist.
     */
    function _setTokenURI(
        uint256 tokenId,
        string memory _tokenURI
    ) internal virtual {
        require(
            _exists(tokenId),
            "ERC721URIStorage: URI set of nonexistent token"
        );
        _tokenURIs[tokenId] = _tokenURI;
    }
}
