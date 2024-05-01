// SPDX-License-Identifier: MIT
pragma solidity 0.8.16;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/utils/Context.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/introspection/ERC165.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/IERC721Metadata.sol";

import "./interfaces/ISBT.sol";

contract SBT is Context, ERC165, IERC721, ISBT, IERC721Metadata {
    error SBT__TransferNotSupported();
    error SBT_ApprovalNotSupported();

    using Counters for Counters.Counter;
    using Address for address;
    using Strings for uint256;

    Counters.Counter private s_tokenIds;

    uint256 public _totalSupply;

    // Token name
    string private _name;

    // Token symbol
    string private _symbol;

    // Mapping from token ID to owner address
    mapping(uint256 => address) private _owners;

    // Mapping owner address to token count
    mapping(address => uint256) private _balances;

    mapping(address => uint256) private s_ownerToTokenId;

    /**
     * @dev Initializes the contract by setting a `name` and a `symbol` to the token collection.
     */
    constructor(string memory name_, string memory symbol_) {
        _name = name_;
        _symbol = symbol_;
    }

    function _mintUsingAutomaticTokenId(address to) internal {
        s_tokenIds.increment();
        uint256 tokenId = s_tokenIds.current();

        s_ownerToTokenId[to] = tokenId;
        _mint(to, tokenId);
    }

    /**
     * @dev See {IERC165-supportsInterface}.
     */
    function supportsInterface(
        bytes4 interfaceId
    ) public view virtual override(ERC165, IERC165) returns (bool) {
        return
            interfaceId == type(IERC721).interfaceId ||
            super.supportsInterface(interfaceId);
    }

    /**
     * @dev See {IERC721-balanceOf}.
     */
    function balanceOf(
        address owner
    ) public view virtual override returns (uint256) {
        require(
            owner != address(0),
            "ERC721: address zero is not a valid owner"
        );
        return _balances[owner];
    }

    /**
     * @dev See {IERC721-ownerOf}.
     */
    function ownerOf(
        uint256 tokenId
    ) public view virtual override returns (address) {
        address owner = _ownerOf(tokenId);
        require(owner != address(0), "ERC721: invalid token ID");
        return owner;
    }

    function getTokenIdOfOwner(address owner) public view returns (uint256) {
        return s_ownerToTokenId[owner];
    }

    /**
     * @dev See {IERC721Metadata-name}.
     */
    function name() public view virtual returns (string memory) {
        return _name;
    }

    /**
     * @dev See {IERC721Metadata-symbol}.
     */
    function symbol() public view virtual returns (string memory) {
        return _symbol;
    }

    /**
     * @dev Returns the owner of the `tokenId`. Does NOT revert if token doesn't exist
     */
    function _ownerOf(uint256 tokenId) internal view virtual returns (address) {
        return _owners[tokenId];
    }

    /**
     * @dev Returns whether `tokenId` exists.
     *
     * Tokens can be managed by their owner or approved accounts via {approve} or {setApprovalForAll}.
     *
     * Tokens start existing when they are minted (`_mint`)
     */
    function _exists(uint256 tokenId) internal view virtual returns (bool) {
        return _ownerOf(tokenId) != address(0);
    }

    /**
     * @dev Mints `tokenId` and transfers it to `to`.
     *
     * Requirements:
     *
     * - `tokenId` must not exist.
     * - `to` cannot be the zero address.
     *
     * Emits a {Transfer} event.
     */
    function _mint(address to, uint256 tokenId) internal virtual {
        require(to != address(0), "ERC721: mint to the zero address");
        require(!_exists(tokenId), "ERC721: token already minted");

        _beforeTokenTransfer(address(0), to, tokenId, 1);

        // Check that tokenId was not minted by `_beforeTokenTransfer` hook
        require(!_exists(tokenId), "ERC721: token already minted");

        unchecked {
            // Will not overflow unless all 2**256 token ids are minted to the same owner.
            // Given that tokens are minted one by one, it is impossible in practice that
            // this ever happens. Might change if we allow batch minting.
            // The ERC fails to describe this case.
            _balances[to] += 1;
            _totalSupply += 1;
        }

        _owners[tokenId] = to;

        emit Transfer(address(0), to, tokenId);
    }

    /**
     * @dev burns `tokenId` and transfers it to `zero address`.
     *
     * Requirements:
     *
     * - `tokenId` must exist.
     * - `from` cannot be the zero address.
     *
     * Emits a {Transfer} event.
     */
    function _burn(address from, uint256 tokenId) internal virtual {
        require(from != address(0), "ERC721: from cannot be a zero address");
        require(_exists(tokenId), "ERC721: token id needs to be minted");

        // When `from` is zero, the tokens will be minted for `to`.
        //When `to` is zero, ``from``'s tokens will be burned.

        _beforeTokenTransfer(from, address(0), tokenId, 1);

        // Check that tokenId was not burned by `_beforeTokenTransfer` hook
        require(_exists(tokenId), "ERC721: token already minted");

        unchecked {
            // Will not overflow unless all 2**256 token ids are minted to the same owner.
            // Given that tokens are minted one by one, it is impossible in practice that
            // this ever happens. Might change if we allow batch minting.
            // The ERC fails to describe this case.
            _balances[from] -= 1;
            _totalSupply -= 1;
        }

        _owners[tokenId] = address(0);
        s_ownerToTokenId[address(0)] = tokenId;

        emit Transfer(from, address(0), tokenId);
    }

    /**
     * @dev Reverts if the `tokenId` has not been minted yet.
     */
    function _requireMinted(uint256 tokenId) internal view virtual {
        require(_exists(tokenId), "ERC721: invalid token ID");
    }

    /**
     * @dev Hook that is called before any token transfer. This includes minting and burning. If {ERC721Consecutive} is
     * used, the hook may be called as part of a consecutive (batch) mint, as indicated by `batchSize` greater than 1.
     *
     * Calling conditions:
     *
     * - When `from` and `to` are both non-zero, ``from``'s tokens will be transferred to `to`.
     * - When `from` is zero, the tokens will be minted for `to`.
     * - When `to` is zero, ``from``'s tokens will be burned.
     * - `from` and `to` are never both zero.
     * - `batchSize` is non-zero.
     *
     * To learn more about hooks, head to xref:ROOT:extending-contracts.adoc#using-hooks[Using Hooks].
     */
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 /* firstTokenId */,
        uint256 batchSize
    ) internal virtual {
        if (batchSize > 1) {
            if (from != address(0)) {
                _balances[from] -= batchSize;
            }
            if (to != address(0)) {
                _balances[to] += batchSize;
            }
        }
    }

    /// @dev Transfer and Allowance function disabling overrides

    /// @dev Function is disabled to make token soulbound
    function safeTransferFrom(
        address,
        address,
        uint256
    ) external pure override {
        revert SBT__TransferNotSupported();
    }

    /// @dev Function is disabled to make token soulbound
    function safeTransferFrom(
        address,
        address,
        uint256,
        bytes calldata
    ) external pure override {
        revert SBT__TransferNotSupported();
    }

    /// @dev Function is disabled to make token soulbound
    function transferFrom(address, address, uint256) external pure override {
        revert SBT__TransferNotSupported();
    }

    /// @dev Function is disabled to make token soulbound
    function approve(address, uint256) external pure override {
        revert SBT_ApprovalNotSupported();
    }

    /// @dev Function is disabled to make token soulbound
    function setApprovalForAll(address, bool) external pure override {
        revert SBT_ApprovalNotSupported();
    }

    /// @dev Function is disabled to make token soulbound
    function getApproved(uint256) external pure override returns (address) {
        return address(0x0);
    }

    /// @dev Function is disabled to make token soulbound
    function isApprovedForAll(
        address,
        address
    ) external pure override returns (bool) {
        return false;
    }

    /**
     * @dev See {IERC721Metadata-tokenURI}.
     */
    function tokenURI(
        uint256 tokenId
    ) public view virtual override returns (string memory) {
        _requireMinted(tokenId);

        string memory baseURI = _baseURI();
        return
            bytes(baseURI).length > 0
                ? string(abi.encodePacked(baseURI, tokenId.toString()))
                : "";
    }

    /**
     * @dev Base URI for computing {tokenURI}. If set, the resulting URI for each
     * token will be the concatenation of the `baseURI` and the `tokenId`. Empty
     * by default, can be overridden in child contracts.
     */
    function _baseURI() internal view virtual returns (string memory) {
        return "";
    }

    function totalSupply() public view virtual returns (uint256) {
        return _totalSupply;
    }
}
