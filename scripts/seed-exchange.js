/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
const Eth = require('web3-eth')
const web3 = require('web3')
const { tokens, ether, ETHER_ADDRESS } = require('../test/helpers')
const Token = artifacts.require('Token')
const Exchange = artifacts.require('Exchange')

const wait = (seconds) => new Promise((resolve) => setTimeout(resolve, seconds * 1000))

module.exports = async (callback) => {
	try {
		const eth = new Eth('HTTP://127.0.0.1:7545')

		const accounts = await eth.getAccounts()

		const token = await Token.deployed()
		console.log('Token fetched', token.address)

		const exchange = await Exchange.deployed()
		console.log('Exchange fetched', exchange.address)

		const sender = accounts[0]
		const receiver = accounts[1]
		let amount = web3.utils.toWei('10000', 'ether')

		await token.transfer(receiver, amount, { from: sender })
		console.log(`Transffered ${amount} tokens from ${sender} to ${receiver}`)

		const user1 = accounts[0]
		const user2 = accounts[1]

		amount = 1
		await exchange.depositEther({ from: user1, value: ether(amount) })
		console.log(`Deposited ${amount} Ether from ${user1}`)

		amount = 10000
		await token.approve(exchange.address, tokens(amount), { from: user2 })
		console.log(`Approved ${amount} tokens from ${user2}`)

		await exchange.depositToken(token.address, tokens(amount), { from: user2 })
		console.log(`Deposited ${amount} tokens from ${user2}`)

		// seed cancelled orders

		// user 1 makes order to get tokens
		let result, orderId

		result = await exchange.makeOrder(token.address, tokens(100), ETHER_ADDRESS, ether(0.1), { from: user1 })
		console.log(`Made order from ${user1}`)
		console.log(result)
		orderId = result.logs[0].args.id
		await exchange.cancelOrder(orderId, { from: user1 })
		console.log(`Cancelled order from ${user1}`)

		// seed filled orders
		result = await exchange.makeOrder(token.address, tokens(100), ETHER_ADDRESS, ether(0.1), { from: user1 })
		console.log(`Make order from ${user1}`)

		orderId = result.logs[0].args.id
		await exchange.filledOrder(orderId, { from: user2 })
		console.log(`filled order from ${user1}`)

		await wait(1)

		result = await exchange.makeOrder(token.address, tokens(50), ETHER_ADDRESS, ether(0.01), { from: user1 })
		console.log(`make order from ${user1}`)

		orderId = result.logs[0].args.id
		await exchange.filledOrder(orderId, { from: user2 })
		console.log(`filled order from ${user1}`)

		await wait(1)

		// seed open orders

		// user1 makes 10 orders
		for (let i = 1; i <= 10; i++) {
			result = await exchange.makeOrder(token.address, tokens(10 * i), ETHER_ADDRESS, ether(0.01), { from: user1 })
			console.log(`Made order from ${user1}`)
			await wait(1)
		}

		// user2 makes 10 orders
		for (let i = 1; i <= 10; i++) {
			result = await exchange.makeOrder(ETHER_ADDRESS, ether(0.01), token.address, tokens(10 * i), { from: user2 })
			console.log(`Made order from ${user2}`)
			await wait(1)
		}
	} catch (err) {
		console.log(err)
	}

	callback()
}
