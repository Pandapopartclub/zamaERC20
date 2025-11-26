import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  console.log("Deploying MyConfidentialToken...");
  console.log("Deployer:", deployer);

  const deployed = await deploy("MyConfidentialToken", {
    from: deployer,
    args: [],
    log: true,
  });

  console.log(`\n✅ MyConfidentialToken deployed!`);
  console.log(`Address: ${deployed.address}`);
  console.log(`TX: ${deployed.transactionHash}`);
};

export default func;
func.id = "deploy_token";
func.tags = ["MyConfidentialToken"];
