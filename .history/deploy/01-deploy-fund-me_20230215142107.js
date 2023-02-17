const { networkConfig } = require("../helper-hardhat-config")
const { network } = require("hardhat")

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId

    //if the contract doesnt exist.
    //since we wont have ethusdPriceFeed adress ofr local host or harhat network,
    // we deploy a minimum version for our local testing.

    //when going for localhost or hardhat network we want to use a mock
    const ethUsdPriceFeedAddress = networkConfig[chainId].ethUsdPriceFeedAddress

    const fundMe = deploy("FundMe", {
        from: deployer,
        args: [], //put priceFeed Arguments in here.
        log: true
    })
}
