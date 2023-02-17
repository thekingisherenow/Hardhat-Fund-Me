const { expect } = require("chai")
const { deployments, getNamedAccounts, ethers } = require("hardhat")

describe("FundMe", async () => {
    let fundMe
    let deployer
    let mockV3Aggregator
    beforeEach(async () => {
        //deploy our fundmecontract. using hardhat-deploy
        deployer = (await getNamedAccounts()).deployments
        await deployments.fixture(["all"]) //runs all the deployment with the tag " all"
        fundMe = await ethers.getContract("FundMe", deployer)
        mockV3Aggregator = await ethers.getContract(
            "MockV3Aggregator",
            deployer
        )
    })
    describe("constructor", () => {
        it(" sets the aggregator address properly", async () => {
            //constructor part check garne ho esma.
            const response = await fundMe.priceFeed()
            expect(response).to.equal(mockV3Aggregator.address)
        })
    })
    describe()
})
