const { expect, assert } = require("chai")
const { deployments, getNamedAccounts, ethers } = require("hardhat")

describe("FundMe", async () => {
    let fundMe
    let deployer
    let mockV3Aggregator
    const sendValue = ethers.utils.parseEther("1") //1 Ether
    beforeEach(async () => {
        //deploy our fundmecontract. using hardhat-deploy
        deployer = (await getNamedAccounts()).deployer

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
            const response = await fundMe.getPriceFeed()
            expect(response).to.equal(mockV3Aggregator.address)
        })
    })
    describe("fund", () => {
        it("Fails if you donot send enough ETH", async () => {
            await expect(fundMe.fund()).to.be.revertedWith(
                "You need to spend more ETH!"
            )
        })
        it("updates the address of the funder along with the amount", async () => {
            //bhanepachi.. suru ma paisa pathaunu paryo....
            await fundMe.fund({ value: sendValue })
            //anii.. deployer ko address ma tyo paisa aayi pugyo ki naai check garcham hami.
            const response = await fundMe.getAddressToAmountFunded(deployer)
            expect(response).to.equal(sendValue)
        })
        it("adds funder to the array of funder", async () => {
            //suru ma paisa pathaunu paryo-acc to code- afai pathaune manche ko naam eeuta list ma halcha
            // address[] = getFunder
            await fundMe.fund({ value: sendValue })
            //aba founders ko list nikalnu paryo ra tyo list ma-- deployer ko naam hunu means-the code works.
            const funder = await fundMe.getFunder(0)
            expect(funder).to.equal(deployer)
        })
    })
    describe("withdraw", async () => {
        beforeEach(async () => {
            await fundMe.fund({ value: sendValue })
        })
        it("withdraw ETH from a single founder", async () => {
            //Arrange
            const startingFundmeBalance = await ethers.provider.getBalance(
                fundMe.address
            )
            const startingDeployerBalance = await ethers.provider.getBalance(
                deployer
            )
            //Act
            const transactionResponse = await fundMe.withdraw()
            const transactionReceipt = await transactionResponse.wait(1)
            const { effectiveGasPrice, gasUsed } = transactionReceipt
            const gasTotalPrice = effectiveGasPrice.mul(gasUsed)
            const endingFundmeBalance = await ethers.provider.getBalance(
                fundMe.address
            )
            const endingDeployerBalance = await ethers.provider.getBalance(
                deployer
            )
            //Assert
            expect(endingFundmeBalance).to.equal(0)
            expect(endingDeployerBalance.add(gasTotalPrice)).to.equal(
                startingDeployerBalance.add(startingFundmeBalance)
            )
        })
        it("allows us to withdraw money when multiple funder have donated.", async () => {
            //arrange,
            const accounts = await ethers.getSigners()
            for (let i = 1; i < 6; i++) {
                const fundMeConnectedContract = await fundMe.connect(
                    accounts[i]
                )
                await fundMeConnectedContract.fund({ value: sendValue })
            }

            const startingFundmeBalance = await ethers.provider.getBalance(
                fundMe.address
            )
            const startingDeployerBalance = await ethers.provider.getBalance(
                deployer
            )
            //act
            const transactionResponse = await fundMe.withdraw()
            const transactionReceipt = await transactionResponse.wait(1)
            const { effectiveGasPrice, gasUsed } = transactionReceipt
            const gasTotalPrice = effectiveGasPrice.mul(gasUsed)
            const endingFundmeBalance = await ethers.provider.getBalance(
                fundMe.address
            )
            const endingDeployerBalance = await ethers.provider.getBalance(
                deployer
            )
            expect(endingDeployerBalance.add(gasTotalPrice)).to.equal(
                startingDeployerBalance.add(startingFundmeBalance)
            )
            assert.equal(endingFundmeBalance, 0)
            await expect(fundMe.getFunder()).to.be.reverted
            for (i = 1; i < 6; i++) {
                let balance = await fundMe.getAddressToAmountFunded(
                    accounts[i].address
                )
                assert.equal(balance, 0)
            }
        })
        it("only allows the owner to withdraw", async () => {
            //kunai arko account le withdraw garneee..
            const accounts = await ethers.getSigners()
            const attacker = accounts[1]
            const attackerConnectedContract = fundMe.connect(attacker)
            await expect(
                attackerConnectedContract.withdraw()
            ).to.be.revertedWith("FundMe__NotOwner")
        })
        it("cheaper withdraw testing", async () => {
            //arrange,
            const accounts = await ethers.getSigners()
            for (let i = 1; i < 6; i++) {
                const fundMeConnectedContract = await fundMe.connect(
                    accounts[i]
                )
                await fundMeConnectedContract.fund({ value: sendValue })
            }

            const startingFundmeBalance = await ethers.provider.getBalance(
                fundMe.address
            )
            const startingDeployerBalance = await ethers.provider.getBalance(
                deployer
            )
            //act
            const transactionResponse = await fundMe.cheaperWithdraw()
            const transactionReceipt = await transactionResponse.wait(1)
            const { effectiveGasPrice, gasUsed } = transactionReceipt
            const gasTotalPrice = effectiveGasPrice.mul(gasUsed)
            const endingFundmeBalance = await ethers.provider.getBalance(
                fundMe.address
            )
            const endingDeployerBalance = await ethers.provider.getBalance(
                deployer
            )
            expect(endingDeployerBalance.add(gasTotalPrice)).to.equal(
                startingDeployerBalance.add(startingFundmeBalance)
            )
            assert.equal(endingFundmeBalance, 0)
            await expect(fundMe.getFunder()).to.be.reverted
            for (i = 1; i < 6; i++) {
                let balance = await fundMe.getAddressToAmountFunded(
                    accounts[i].address
                )
                assert.equal(balance, 0)
            }
        })
    })
})
