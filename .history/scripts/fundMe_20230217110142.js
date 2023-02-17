const { getNamedAccounts, ethers } = require("hardhat")

const main = async () => {
    const { deployer } = await getNamedAccounts().deployer
    const fundMe = await ethers.getContract("FundMe", deployer)
    const transactionResponse = await fundMe.fund({
        value: ethers.utils.parseEther("0.2")
    })
    await transactionResponse.wait(1)
}
main()
    .then(() => {
        process.exit(0)
    })
    .catch(e => {
        console.error(e)
        process.exit(1)
    })
