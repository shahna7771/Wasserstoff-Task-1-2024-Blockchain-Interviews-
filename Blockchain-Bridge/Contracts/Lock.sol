// SPDX-License-Identifier: MIT
pragma solidity ^ 0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract EVM_side {
    event TokensLocked(address indexed sender, address indexed targetChain, address indexed receiver, uint256 amount);

    // Locking of ERC20 tokens
    function lockERC20(address tokenAddress, uint256 amount, address targetChain, address receiver) external {
        require(tokenAddress != address(0), "Invalid token address");
        require(amount > 0, "Invalid amount");
        require(targetChain != address(0), "Invalid target chain address");
        require(receiver != address(0), "Invalid receiver address");

        IERC20 token = IERC20(tokenAddress);
        require(token.transferFrom(msg.sender, address(this), amount), "Token transfer failed");

        emit TokensLocked(msg.sender, targetChain, receiver, amount);
    }

    // Locking of native ETH
    function lockETH(address targetChain, address receiver) external payable {
        require(msg.value > 0, "Invalid ETH amount");
        require(targetChain != address(0), "Invalid target chain address");
        require(receiver != address(0), "Invalid receiver address");

        emit TokensLocked(msg.sender, targetChain, receiver, msg.value);
    }
}
