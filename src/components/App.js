/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { Component } from 'react'
import './App.css'
import { connect } from 'react-redux'
import { loadWeb3 } from '../store/interactions'
import Token from '../abis/Token.json'

class App extends Component {
	componentDidMount() {
		this.loadBlockchainData(this.props.dispatch)
	}

	async loadBlockchainData(dispatch) {
		const web3 = loadWeb3(dispatch)
		// const network = await web3.eth.net.getNetworkType()

		const networkId = await web3.eth.net.getId()

		// const accounts = await web3.eth.getAccounts()

		const token = new web3.eth.Contract(Token.abi, Token.networks[networkId].address)

		const totalSupply = await token.methods.totalSupply().call()
		console.log(totalSupply)
	}

	render() {
		return (
			<div>
				<nav className="navbar navbar-expand-lg navbar-dark bg-primary">
					<a className="navbar-brand" href="#">
						Navbar
					</a>
					<button
						className="navbar-toggler"
						type="button"
						data-toggle="collapse"
						data-target="#navbarNav"
						aria-controls="navbarNav"
						aria-expanded="false"
						aria-label="Toggle navigation"
					>
						<span className="navbar-toggler-icon"></span>
					</button>
					<div className="collapse navbar-collapse" id="navbarNav">
						<ul className="navbar-nav">
							<li className="nav-item active">
								<a className="nav-link" href="#">
									Home <span className="sr-only">(current)</span>
								</a>
							</li>
							<li className="nav-item">
								<a className="nav-link" href="#">
									Features
								</a>
							</li>
							<li className="nav-item">
								<a className="nav-link" href="#">
									Pricing
								</a>
							</li>
							<li className="nav-item">
								<a className="nav-link" href="#">
									Disabled
								</a>
							</li>
						</ul>
					</div>
				</nav>
				<div className="content">
					<div className="vertical-split">
						<div className="card bg-dark text-white">
							<div className="card-header">Card Title</div>
							<div className="card-body">
								<p className="card-text">
									Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the
								</p>
								<a href="#" className="card-link">
									Card link
								</a>
							</div>
						</div>
						<div className="card bg-dark text-white">
							<div className="card-header">Card Title</div>
							<div className="card-body">
								<p className="card-text">
									Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the{' '}
								</p>
								<a href="#" className="card-link">
									Card link
								</a>
							</div>
						</div>
					</div>
				</div>
			</div>
		)
	}
}

function mapStateToProps(state) {
	return {}
}

export default connect(mapStateToProps)(App)
