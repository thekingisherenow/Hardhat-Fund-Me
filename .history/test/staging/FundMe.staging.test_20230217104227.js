const { expect } = require("chai")
const { getNamedAccounts, deployments, ethers, network } = require("hardhat")
const { developmentChains } = require("../../helper-hardhat-config")

developmentChains.includes(network.name)
    ? describe.skip
    : describe("FundMe", async () => {
          let fundMe
          let deployer
          const sendValue = ethers.utils.parseEther("1")
          beforeEach(async () => {
              //contract deploy garnu paryo yaha.
              deployer = (await getNamedAccounts()).deployer
              await deployments.fixture(["all"])
              fundMe = await ethers.getContract("FundMe", deployer) //difference between--getCOntract and deployments.get--not understood
              //could be coz. get contract ma deployer halekale-ekai choti signer banauna paiyo.
          })
          //j hos eeuta it chahiyo..
          it("should fund and withdraw money", async () => {
              const transactionResponse = await fundMe.fund({
                  value: sendValue
              })
              const transactionReceipt = transactionResponse.wait(1)
              await fundMe.withdraw()
              const endingFundMeBalance = ethers.provicers.getBalance(
                  fundMe.address
              )
              expect(endingFundMeBalance).to.equal("0")
          })
      })
