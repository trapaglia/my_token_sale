const BeToken = artifacts.require("BeToken");
const BeTokenSale = artifacts.require("BeTokenSale");

module.exports = function (deployer) {
  deployer.deploy(BeToken, 1000000).then(function() {
      var tokenPrice = 2000000000000000; // in wei
      return deployer.deploy(BeTokenSale, BeToken.address, tokenPrice);
  });
};
