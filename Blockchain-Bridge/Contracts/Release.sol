// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract NonEvmReleaseContract is EVM_side {
    address public evmBridge; // Address of the EVM bridge contract

    // Event emitted when tokens are released
    event TokensReleased(address indexed receiver, uint256 amount);

    modifier onlyEvmBridge() {
        require(msg.sender == evmBridge, "Only EVM bridge can call this function");
        _;
    }

    constructor(address _evmBridge) {
        evmBridge = _evmBridge;
    }

    // Function for release tokens on the non-EVM chain on confirmation from the EVM side
    function releaseTokens(address receiver, uint256 amount) external onlyEvmBridge {
       
        require(centralizedVerification(msg.sender, receiver, amount), "Lock event verification failed");

        
         token .transfer(receiver, amount);

        // Emit event indicating tokens have been released
        emit TokensReleased(receiver, amount);
    }

    // Centralized verification logic (replace with your actual verification logic)
    function centralizedVerification(address sender, address receiver, uint256 amount) internal view returns (bool) {
        
        require(receiver!=address(0),amount==msg.value);
        return true;
    }
}