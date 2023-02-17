const { network } = require("hardhat")
const { developmentChains } = require("../helper-hardhat-config")

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    //log bhaneko console.log jastai ho--deployment ko information dincha bhanam na...
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId

    if (developmentChains.includes(chainId)) {
        log("Local netwok detected ! Deploying mocks.")
        await deploy("MockV3Aggregator")
    }
}
