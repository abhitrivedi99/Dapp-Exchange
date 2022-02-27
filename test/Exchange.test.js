/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import { tokens, EVM_REVERT, ETHER_ADDRESS, ether } from './helpers'
const Exchange = artifacts.require('./Exchange')
const Token = artifacts.require('./Token')

require('chai').use(require('chai-as-promised')).should()

contract('Exchange', ([deployer, feeAccount, user1]) => {
	let exchange, token
	const feePercent = 10

	beforeEach(async () => {
		// Deploy token
		token = await Token.new()

		//  Transfer some tokens to user1
		token.transfer(user1, tokens(100), { from: deployer })

		// Deploy exchange
		exchange = await Exchange.new(feeAccount, feePercent)
	})

	describe('deployment', () => {
		it('tracks the fee account', async () => {
			const result = await exchange.feeAccount()
			result.should.equal(feeAccount)
		})

		it('tracks the fee percentage', async () => {
			const result = await exchange.feePercent()
			result.toString().should.equal(feePercent.toString())
		})
	})

	describe('depositing Ether', () => {
		let result, amount

		beforeEach(async () => {
			amount = ether(1)
			result = await exchange.depositEther({ from: user1, value: amount })
		})

		it('tracks the Ether deposit', async () => {
			const balance = await exchange.tokens(ETHER_ADDRESS, user1)
			balance.toString().should.equal(amount.toString())
		})

		it('emits an Deposit event', async () => {
			const log = result.logs[0]
			log.event.should.eq('Deposit')
			const event = log.args
			event.token.should.eq(ETHER_ADDRESS, 'ether address is correct')
			event.user.should.eq(user1, 'user address is correct')
			event.amount.toString().should.eq(amount.toString(), 'amount is correct')
			event.balance.toString().should.equal(amount.toString(), 'balance is correct')
		})
	})

	describe('deposit tokens', () => {
		let result, amount

		describe('success', () => {
			beforeEach(async () => {
				amount = tokens(10)
				await token.approve(exchange.address, amount, { from: user1 })
				result = await exchange.depositToken(token.address, amount, { from: user1 })
			})

			it('tracks the token deposit', async () => {
				// check exchange token balance
				let balance
				balance = await token.balanceOf(exchange.address)
				balance.toString().should.equal(amount.toString())
				balance = await exchange.tokens(token.address, user1)
				balance.toString().should.equal(amount.toString())
			})

			it('emits an Deposit event', async () => {
				const log = result.logs[0]
				log.event.should.eq('Deposit')
				const event = log.args
				event.token.should.eq(token.address, 'token address is correct')
				event.user.should.eq(user1, 'user address is correct')
				event.amount.toString().should.eq(amount.toString(), 'amount is correct')
				event.balance.toString().should.equal(amount.toString(), 'balance is correct')
			})
		})

		describe('failure', () => {
			it('fails when no tokens are approved', async () => {
				await exchange.depositToken(token.address, amount, { from: user1 }).should.be.rejectedWith(EVM_REVERT)
			})

			it('rejectes Ether Deposit', async () => {
				await exchange
					.depositToken(ETHER_ADDRESS, tokens(10), {
						from: user1,
					})
					.should.be.rejectedWith(EVM_REVERT)
			})
		})
	})

	describe('fallback', () => {
		it('reverts when Ether is sent', async () => {
			await exchange.sendTransaction({ from: user1, value: 1 }).should.be.rejectedWith(EVM_REVERT)
		})
	})

	describe('withdrawing Ether', () => {
		let result, amount

		beforeEach(async () => {
			amount = ether(1)
			result = await exchange.depositEther({ from: user1, value: amount })
		})

		describe('success', () => {
			beforeEach(async () => {
				await exchange.withdrawEther(amount, { from: user1 })
			})

			it('withdraws Ether funds', async () => {
				const balance = await exchange.tokens(ETHER_ADDRESS, user1)
				balance.toString().should.equal('0')
			})

			it('emits a Withdraw event', async () => {
				const log = result.logs[0]
				console.log(log)
				log.event.should.eq('Withdraw')
				const event = log.args
				event.token.should.eq(ETHER_ADDRESS)
				event.user.should.eq(user1)
				event.amount.toString().should.eq(amount.toString())
				event.balance.toString().should.equal('0')
			})
		})

		describe('failure', () => {
			it('reject withdraws for insufficient balance', async () => {
				await exchange.withdrawEther(ether(100), { from: user1 }).should.be.rejectedWith(EVM_REVERT)
			})
		})
	})

	describe('withdrawing tokens', () => {
		let result, amount

		beforeEach(async () => {
			amount = tokens(1)
			result = await exchange.depositEther({ from: user1, value: amount })
		})

		describe('success', () => {
			beforeEach(async () => {
				amount = tokens(1)
				await token.approve(exchange.address, amount, { from: user1 })
				await exchange.depositToken(token.address, amount, { from: user1 })

				result = await exchange.withdrawToken(token.address, amount, { from: user1 })
			})

			it('withdraws token funds', async () => {
				const balance = await exchange.tokens(token.address, user1)
				balance.toString().should.equal('0')
			})

			it('emits a Withdraw event', async () => {
				const log = result.logs[0]
				log.event.should.eq('Withdraw')
				const event = log.args
				event.token.should.eq(token.address)
				event.user.should.eq(user1)
				event.amount.toString().should.eq(amount.toString())
				event.balance.toString().should.equal('0')
			})
		})

		describe('failure', () => {
			it('reject ether withdraws', async () => {
				await exchange
					.withdrawToken(ETHER_ADDRESS, tokens(10), { from: user1 })
					.should.be.rejectedWith(EVM_REVERT)
			})

			it('fails for insufficient balances', async () => {
				await exchange
					.withdrawToken(token.address, tokens(10), { from: user1 })
					.should.be.rejectedWith(EVM_REVERT)
			})
		})
	})

	describe('checking balances', async () => {
		beforeEach(async () => {
			await exchange.depositEther({ from: user1, value: ether(1) })
		})

		it('returns user balance', async () => {
			const result = await exchange.balanceOf(ETHER_ADDRESS, user1)
			result.toString().should.be.equal(ether(1).toString())
		})
	})
})