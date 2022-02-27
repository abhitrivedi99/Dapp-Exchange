/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import { tokens, EVM_REVERT } from './helpers'
const Token = artifacts.require('./Token')

require('chai').use(require('chai-as-promised')).should()

contract('Token', ([deployer, receiver, exchange]) => {
	const name = 'Wayne Token'
	const symbol = 'Wayne'
	const decimal = '18'
	const totalSupply = tokens(1000000).toString()
	let token

	beforeEach(async () => {
		/**
		 * {@link tokens}
		 */
		token = await Token.new()
	})

	describe('deployment', () => {
		it('tracks the name', async () => {
			const result = await token.name()
			result.should.equal(name)
			// Read token name here...
		})

		it('tracks the symbol', async () => {
			const result = await token.symbol()
			result.should.equal(symbol)
		})

		it('tracks the decimal', async () => {
			const result = await token.decimals()
			result.toString().should.equal(decimal)
		})

		it('tracks the total supply', async () => {
			const result = await token.totalSupply()
			result.toString().should.equal(totalSupply.toString())
		})

		it('assigns the total supply of the deployment', async () => {
			const result = await token.balanceOf(deployer)
			result.toString().should.equal(totalSupply.toString())
		})
	})

	describe('sending tokens', () => {
		let amount
		let result

		describe('success', () => {
			beforeEach(async () => {
				amount = tokens(100)
				result = await token.transfer(receiver, amount, { from: deployer })
			})

			it('transfers token balances', async () => {
				let balanceOf

				balanceOf = await token.balanceOf(deployer)
				balanceOf.toString().should.equal(tokens(999900).toString())
				balanceOf = await token.balanceOf(receiver)
				balanceOf.toString().should.equal(tokens(100).toString())
			})

			it('event should triggered', async () => {
				const log = result.logs[0]
				log.event.should.eq('Transfer')
				const event = log.args
				event.from.toString().should.eq(deployer, 'from is correct')
				event.to.toString().should.eq(receiver, 'to is correct')
				event.value.toString().should.equal(amount.toString(), 'value is correct')
			})
		})

		describe('failure', () => {
			it('rejects insufficient balances', async () => {
				let invalidAmount
				invalidAmount = tokens(100000000)

				// TODO: Trying to transfer 100M tokens which is greater than totalSupply
				await token.transfer(receiver, invalidAmount, { from: deployer }).should.be.rejectedWith(EVM_REVERT)

				invalidAmount = tokens(10)

				// TODO: Trying to transfer 10 tokens when receiver has no tokens
				await token.transfer(deployer, invalidAmount, { from: receiver }).should.be.rejectedWith(EVM_REVERT)
			})

			it('rejects invalid receipients', async () => {
				await token.transfer(0x0, amount, { from: deployer }).should.be.rejected
			})
		})
	})

	describe('approving tokens', () => {
		let amount, result

		beforeEach(async () => {
			amount = tokens(100)
			result = await token.approve(exchange, amount, { from: deployer })
		})

		describe('success', () => {
			it('allocates an allowance for delegated token spending on exchange', async () => {
				const allowance = await token.allowance(deployer, exchange)
				allowance.toString().should.equal(amount.toString())
			})

			it('emits an Approval event', async () => {
				const log = result.logs[0]
				log.event.should.eq('Approval')
				const event = log.args
				event.owner.toString().should.eq(deployer, 'owner is correct')
				event.spender.toString().should.eq(exchange, 'spender is correct')
				event.value.toString().should.equal(amount.toString(), 'value is correct')
			})
		})

		describe('failure', () => {
			it('rejects invalid spenders', async () => {
				await token.approve(0x0, amount, { from: deployer }).should.be.rejected
			})
		})
	})

	describe('delegated token transfers', () => {
		let amount
		let result
		let allowance

		beforeEach(async () => {
			amount = tokens(100)
			await token.approve(exchange, amount, { from: deployer })
		})

		describe('success', async () => {
			beforeEach(async () => {
				result = await token.transferFrom(deployer, receiver, amount, { from: exchange })
			})

			it('transfers token balances', async () => {
				let balanceOf

				balanceOf = await token.balanceOf(deployer)
				balanceOf.toString().should.equal(tokens(999900).toString())
				balanceOf = await token.balanceOf(receiver)
				balanceOf.toString().should.equal(tokens(100).toString())
			})

			it('resets the allowance', async () => {
				allowance = await token.allowance(deployer, exchange)
				allowance.toString().should.equal('0')
			})

			it('event should triggered', async () => {
				const log = result.logs[0]
				log.event.should.eq('Transfer')
				const event = log.args
				event.from.toString().should.eq(deployer, 'from is correct')
				event.to.toString().should.eq(receiver, 'to is correct')
				event.value.toString().should.equal(amount.toString(), 'value is correct')
			})
		})

		describe('failure', () => {
			it('rejects insufficient balances', async () => {
				let invalidAmount
				invalidAmount = tokens(100000000)
				await token
					.transferFrom(deployer, receiver, invalidAmount, { from: exchange })
					.should.be.rejectedWith(EVM_REVERT)
			})
			it('rejects invalid receipients', async () => {
				await token.transferFrom(deployer, 0x0, amount, { from: exchange }).should.be.rejected
			})
		})
	})
})
