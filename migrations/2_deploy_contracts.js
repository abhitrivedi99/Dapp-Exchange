/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
const Eth = require('web3-eth')
const Token = artifacts.require('Token')
const Exchange = artifacts.require('Exchange')

module.exports = async (deployer) => {
	const eth = new Eth('HTTP://127.0.0.1:7545')

	const accounts = await eth.getAccounts()
	await deployer.deploy(Token)

	const feeAccount = accounts[0]
	const feePercent = 10

	await deployer.deploy(Exchange, feeAccount, feePercent)
}
