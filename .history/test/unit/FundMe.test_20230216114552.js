const { expect } = require("chai")
const { deployments, getNamedAccounts, ethers } = require("hardhat")

describe("FundMe", async () => {
    let fundMe
    let deployer
    let mockV3Aggregator
    const sendValue = ethers.utils.parseEther("1") //1 Ether
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
    describe("fund", () => {
        it("Fails if you donot send enough ETH", () => {})
        it.only("updates the address of the funder along with the amount", async () => {
            //bhanepachi.. suru ma paisa pathaunu paryo....
            await fundMe.fund({ value: sendValue })
            //anii.. deployer ko address ma tyo paisa aayi pugyo ki naai check garcham hami.
            const response = await fundMe.addressToAmountFunded(deployer)
            expect(response).to.equal(sendValue)
        })
    })
})
