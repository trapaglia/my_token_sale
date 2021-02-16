const BeToken = artifacts.require("BeToken");

module.exports = function (deployer) {
  deployer.deploy(BeToken, 1000000);
};
