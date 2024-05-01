// SPDX-License-Identifier: MIT

pragma solidity 0.8.16;

// import "../libraries/Authorizable.sol";
// import "../interfaces/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Treasury is Ownable {
    ///@param _amount The amount of ETH to send.
    ///@param _recipient The recipient of this value.
    function withdrawFunds(uint256 _amount, address _recipient) external onlyOwner {
        require(_amount <= address(this).balance, "Insufficient balance");
        payable(_recipient).transfer(_amount);
    }

    receive() external payable {}
}
