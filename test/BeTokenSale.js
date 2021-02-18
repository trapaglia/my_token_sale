const BN = require('bn.js');
var BeToken = artifacts.require('BeToken');
var BeTokenSale = artifacts.require('BeTokenSale');

contract('BeTokenSale', function(accounts) {
    var tokenSaleInstance;
    var tokenInstance;
    var admin = accounts[0];
    var buyer = accounts[1];
    var tokenPrice = 2000000000000000; // in wei
    var tokenPriceEth = 0.002; // in eth 
    var tokensAvailable = 750000;
    var numberOfTokens = 15
    var value = numberOfTokens * tokenPrice;

    it('initializes the contract with the correct values', function() {
        return BeTokenSale.deployed().then(function(instance) {
            tokenSaleInstance = instance;
            return tokenSaleInstance.address
        }).then(function(address) {
            assert.notEqual(address, 0x0, 'has contract address');
            return tokenSaleInstance.tokenContract();
        }).then(function(address) {
            assert.notEqual(address, 0x0, 'has token contract address');
            return tokenSaleInstance.tokenPrice();
        }).then(function(price) {
            assert.equal(price, tokenPrice, 'token price is correct');
        });
    });


    it('facilitates token buying', function() {
        return BeToken.deployed().then(function(instance) {
            // Grab token instance first
            tokenInstance = instance;
            return BeTokenSale.deployed();
        }).then(function(instance) {
            // Then grab token sale instance
            tokenSaleInstance = instance;
            // Provision 75% of all tokens to the token sale
            return tokenInstance.transfer(tokenSaleInstance.address, tokensAvailable, { from: admin })
        }).then(function(receipt) {
            return tokenSaleInstance.buyTokens(numberOfTokens, { from: buyer, value: numberOfTokens * tokenPrice })
        }).then(function(receipt) {
            assert.equal(receipt.logs.length, 1, "triggers one event");
            assert.equal(receipt.logs[0].event, "Sell", 'should be the "Sell" event');
            assert.equal(receipt.logs[0].args._buyer, buyer, 'logs the account that purchased the tokens');
            assert.equal(receipt.logs[0].args._amount.toNumber(), numberOfTokens, 'logs the number of tokens purchased');
            return tokenSaleInstance.tokensSold();
        }).then(function(amount) {
            assert.equal(amount.toNumber(), numberOfTokens, 'increments the number of tokens sold');
            return tokenInstance.balanceOf(buyer);
        }).then(function(balance) {
            assert.equal(balance.toNumber(), numberOfTokens, 'check buyer new balance');
            return tokenInstance.balanceOf(tokenSaleInstance.address);
        }).then(function(balance) {
            assert.equal(balance.toNumber(), tokensAvailable - numberOfTokens, 'check sustracted amount');
            return tokenSaleInstance.buyTokens(numberOfTokens, {from: buyer, value: 2});
        }).then(assert.fail).catch(function(error) {
            assert(error.message.indexOf('revert') >= 0, 'msg.value must equal number of tokens in wei');
            var tempPrice = 800000 * tokenPriceEth;
            return tokenSaleInstance.buyTokens(800000, {from: buyer, value: new BN(tempPrice) });
        }).then(assert.fail).catch(function(error) {
            // assert.equal(error.message, "algo", "bla"); //have to find workaround for big numbesr
            assert(error.message.indexOf('revert') >= 0, 'cannot purchase more tokens than available');
        });
    });


});
