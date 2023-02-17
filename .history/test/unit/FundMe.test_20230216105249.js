const { expect } = require("chai")
const { deployments, getNamedAccounts, ethers } = require("hardhat")

describe("FundMe", async () => {
    let fundMe
    let deployer
    beforeEach(async () => {
        //deploy our fundmecontract. using hardhat-deploy
        deployer = (await getNamedAccounts()).deployments
        await deployments.fixture(["all"]) //runs all the deployment with the tag " all"
        fundMe = await ethers.getContract("FundMe", deployer)
    })

    it("constructor", async () => {
        //constructor part check garne ho esma.
    })
})
