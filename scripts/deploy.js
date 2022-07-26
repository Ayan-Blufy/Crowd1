

const main = async () => {
 
  const crowdfunding = await ethers.getContractFactory("crowdfunding");
  const contractInstance=await crowdfunding.deploy();

  console.log("Transactions address: ", contractInstance.address);
};

main().then(() => {
  process.exit(0);
}).catch((err) => {
  console.log(err);
  process.exit(1);
})

