require("@nomiclabs/hardhat-waffle");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.9",
  networks: {
    goerli: {
      url: 'https://eth-goerli.g.alchemy.com/v2/Qo1DxQ8U6Hzw3Da7p3n7zTlD0xUgMR4t',
      accounts: ['cc8af823f83b703202ad6bd0a4b232180e49afdad7e32f7ec302ed25032f082a'],
    },
  },
};
