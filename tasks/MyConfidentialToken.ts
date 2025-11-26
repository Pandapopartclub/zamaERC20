import { FhevmType } from "@fhevm/hardhat-plugin";
import { task } from "hardhat/config";
import type { TaskArguments } from "hardhat/types";

const CONTRACT_ADDRESS = "0x7ed7DF536fBeE3E7644BfAaB4490307b13B5883e";

task("token:info")
  .setDescription("Affiche les infos du token")
  .setAction(async function (_taskArguments: TaskArguments, hre) {
    const { ethers } = hre;
    const [signer] = await ethers.getSigners();
    const token = await ethers.getContractAt("MyConfidentialToken", CONTRACT_ADDRESS, signer);

    const name = await token.name();
    const symbol = await token.symbol();
    const decimals = await token.decimals();
    const totalSupply = await token.totalSupply();
    const hasBalance = await token.hasBalance(signer.address);

    console.log(`\n📊 TOKEN INFO`);
    console.log(`═══════════════════════════════════`);
    console.log(`Name: ${name}`);
    console.log(`Symbol: ${symbol}`);
    console.log(`Decimals: ${decimals}`);
    console.log(`Total Supply: ${totalSupply}`);
    console.log(`Contract: ${CONTRACT_ADDRESS}`);
    console.log(`\n💰 YOUR WALLET`);
    console.log(`Address: ${signer.address}`);
    console.log(`Has balance: ${hasBalance}\n`);
  });

task("token:balance")
  .setDescription("Affiche le handle de balance chiffré")
  .addParam("address", "L'adresse à vérifier")
  .setAction(async function (taskArguments: TaskArguments, hre) {
    const { ethers } = hre;
    const [signer] = await ethers.getSigners();
    const token = await ethers.getContractAt("MyConfidentialToken", CONTRACT_ADDRESS, signer);

    const balanceHandle = await token.balanceOf(taskArguments.address);
    const hasBalance = await token.hasBalance(taskArguments.address);

    console.log(`\n💰 BALANCE INFO`);
    console.log(`═══════════════════════════════════`);
    console.log(`Address: ${taskArguments.address}`);
    console.log(`Has balance: ${hasBalance}`);
    console.log(`Handle: ${balanceHandle}\n`);
  });

task("token:decrypt")
  .setDescription("Déchiffre ta balance")
  .setAction(async function (_taskArguments: TaskArguments, hre) {
    const { ethers, fhevm } = hre;

    await fhevm.initializeCLIApi();

    const signers = await ethers.getSigners();
    const token = await ethers.getContractAt("MyConfidentialToken", CONTRACT_ADDRESS, signers[0]);

    const balanceHandle = await token.balanceOf(signers[0].address);
    const hasBalance = await token.hasBalance(signers[0].address);

    console.log(`\n🔓 DÉCHIFFREMENT BALANCE`);
    console.log(`═══════════════════════════════════`);
    console.log(`Address: ${signers[0].address}`);
    console.log(`Has balance: ${hasBalance}`);

    if (!hasBalance) {
      console.log(`\n💰 Balance: 0 ZTT\n`);
      return;
    }

    console.log(`\n⏳ Demande de déchiffrement...`);

    try {
      const balance = await fhevm.userDecryptEuint(FhevmType.euint32, balanceHandle, CONTRACT_ADDRESS, signers[0]);
      console.log(`\n✅ BALANCE DÉCHIFFRÉE: ${balance} ZTT\n`);
    } catch (error) {
      console.log(`\n⚠️ Déchiffrement en attente ou erreur relayer`);
      console.log(`${error}\n`);
    }
  });

task("token:transfer")
  .setDescription("Transfère des tokens (chiffrés)")
  .addParam("to", "Adresse du destinataire")
  .addParam("amount", "Montant à transférer")
  .setAction(async function (taskArguments: TaskArguments, hre) {
    const { ethers, fhevm } = hre;

    const amount = parseInt(taskArguments.amount);
    if (!Number.isInteger(amount)) {
      throw new Error(`Argument --amount is not an integer`);
    }

    await fhevm.initializeCLIApi();

    const signers = await ethers.getSigners();
    const token = await ethers.getContractAt("MyConfidentialToken", CONTRACT_ADDRESS, signers[0]);

    console.log(`\n🔐 TRANSFER CONFIDENTIEL`);
    console.log(`═══════════════════════════════════`);
    console.log(`From: ${signers[0].address}`);
    console.log(`To: ${taskArguments.to}`);
    console.log(`Amount: ${amount} ZTT (sera chiffré)`);

    console.log(`\n⏳ Chiffrement du montant...`);

    const encryptedValue = await fhevm
      .createEncryptedInput(CONTRACT_ADDRESS, signers[0].address)
      .add32(amount)
      .encrypt();

    console.log(`✅ Montant chiffré !`);
    console.log(`📤 Envoi de la transaction...`);

    const tx = await token
      .connect(signers[0])
      .transfer(taskArguments.to, encryptedValue.handles[0], encryptedValue.inputProof);

    console.log(`⏳ Attente de confirmation...`);
    console.log(`TX: ${tx.hash}`);

    const receipt = await tx.wait();

    console.log(`\n✅ TRANSFER RÉUSSI !`);
    console.log(`═══════════════════════════════════`);
    console.log(`Status: ${receipt?.status === 1 ? "SUCCESS" : "FAILED"}`);
    console.log(`Gas used: ${receipt?.gasUsed}`);
    console.log(`\n🔗 Etherscan: https://sepolia.etherscan.io/tx/${tx.hash}\n`);
  });
