// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {FHE, euint32, externalEuint32, ebool} from "@fhevm/solidity/lib/FHE.sol";
import {ZamaEthereumConfig} from "@fhevm/solidity/config/ZamaConfig.sol";

/// @title MyConfidentialToken - Token ERC-20 Confidentiel avec FHEVM
/// @notice Token avec balances chiffrées utilisant la nouvelle API FHE
contract MyConfidentialToken is ZamaEthereumConfig {
    // ============ METADATA ============
    string public constant name = "ZamaTestToken";
    string public constant symbol = "ZTT";
    uint8 public constant decimals = 6;

    // ============ STATE ============
    uint32 private _totalSupply;
    mapping(address => euint32) internal _balances;

    // ============ EVENTS ============
    event Transfer(address indexed from, address indexed to);
    event Mint(address indexed to, uint32 amount);

    // ============ CONSTRUCTOR ============
    constructor() {
        uint32 initialSupply = 1000000; // 1M tokens

        _balances[msg.sender] = FHE.asEuint32(initialSupply);
        FHE.allowThis(_balances[msg.sender]);
        FHE.allow(_balances[msg.sender], msg.sender);

        _totalSupply = initialSupply;

        emit Mint(msg.sender, initialSupply);
        emit Transfer(address(0), msg.sender);
    }

    // ============ VIEW FUNCTIONS ============

    function totalSupply() public view returns (uint32) {
        return _totalSupply;
    }

    function balanceOf(address account) public view returns (euint32) {
        return _balances[account];
    }

    function hasBalance(address account) public view returns (bool) {
        return euint32.unwrap(_balances[account]) != 0;
    }

    // ============ TRANSFER ============

    function transfer(address to, externalEuint32 encryptedAmount, bytes calldata inputProof) public returns (bool) {
        require(to != address(0), "Transfer to zero address");
        require(to != msg.sender, "Transfer to self");

        euint32 amount = FHE.fromExternal(encryptedAmount, inputProof);

        ebool hasEnough = FHE.le(amount, _balances[msg.sender]);
        euint32 transferAmount = FHE.select(hasEnough, amount, FHE.asEuint32(0));

        _balances[msg.sender] = FHE.sub(_balances[msg.sender], transferAmount);
        _balances[to] = FHE.add(_balances[to], transferAmount);

        FHE.allowThis(_balances[msg.sender]);
        FHE.allow(_balances[msg.sender], msg.sender);
        FHE.allowThis(_balances[to]);
        FHE.allow(_balances[to], to);

        emit Transfer(msg.sender, to);
        return true;
    }
}
