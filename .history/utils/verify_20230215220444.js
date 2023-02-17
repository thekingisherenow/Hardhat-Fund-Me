const { run } = require("hardhat")

const verify = async (contractAddress, args) => {
    console.log("Verifying contracts")
    try {
        await run("verify:verify", {
            address: contractAddress,
            constructorArguments: args
        })
    }
}
