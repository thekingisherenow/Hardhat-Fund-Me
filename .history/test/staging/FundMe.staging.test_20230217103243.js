const { getNamedAccounts, deployments, ethers } = require("hardhat")

describe("FundMe", async () => {
    let fundMe
    const spendValue = ethers.utils.parseEther("1")
    beforeEach(async () => {
        //contract deploy garnu paryo yaha.
        const deployer = (await getNamedAccounts()).deployer
        await deployments.fixture(["all"])
        fundMe = await ethers.getContract("FundMe", deployer)
    })
    //j hos eeuta it chahiyo..
    it("should fund and withdraw money", async () => {})
})
