# 🔐 Confidential ERC-20 Token with FHEVM

An ERC-20 token with **encrypted balances** using Zama FHEVM on Sepolia testnet.

## 🎯 What this project does

- ✅ **100% encrypted** balances on-chain
- ✅ Confidential transfers (amount is invisible)
- ✅ Only the owner can decrypt their balance
- ✅ Compatible with Sepolia testnet

## ⚠️ Discovered Pitfall

The old `fhevm-contracts` API is **DEPRECATED** and no longer works!

// ❌ BROKEN - Do not use
import "fhevm/lib/TFHE.sol";
TFHE.asEuint32(einput, proof);

// ✅ WORKS - New API
import "@fhevm/solidity/lib/FHE.sol";
FHE.fromExternal(externalEuint32, proof);


## 🚀 Installation

git clone https://github.com/Pandapopartclub/zamaERC20.git
cd zamaERC20
npm install


## ⚙️ Configuration

Create a `.env` file:

SEPOLIA_RPC_URL=https://ethereum-sepolia-rpc.publicnode.com
PRIVATE_KEY=your_private_key_here


## 📝 Commands

# Compile
npx hardhat compile

# Deploy
npx hardhat deploy --network sepolia --tags MyConfidentialToken

# View token info
npx hardhat token:info --network sepolia

# Decrypt your balance
npx hardhat token:decrypt --network sepolia

# Transfer tokens
npx hardhat token:transfer --to 0xADDRESS --amount 1000 --network sepolia

# View a balance (encrypted handle)
npx hardhat token:balance --address 0xADDRESS --network sepolia

## 📊 Deployed Contract

- **Network**: Sepolia
- **Address**: `0x7ed7DF536fBeE3E7644BfAaB4490307b13B5883e`
- **Token**: ZamaTestToken (ZTT)
- **Decimals**: 6
- **Total Supply**: 1,000,000

## 🔗 Links

- [Zama FHEVM Docs](https://docs.zama.ai/fhevm)
- [Zama Creator Program](https://www.zama.ai/creator-program)

## 👤 Author

PandaPop - Zama Creator Program Season 4

---

Built with ❤️ for #ZamaCreatorProgram
