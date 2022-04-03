/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { loadWeb3, loadNetworkId, loadToken, loadExchange, loadAccount, loadNetwork } from '../store/interactions'

import './App.css'

const loadBlockchainData = async (dispatch) => {
	const web3 = loadWeb3(dispatch)
	loadNetwork(web3, dispatch)

	await loadAccount(web3, dispatch)

	const networkId = await loadNetworkId(web3, dispatch)

	loadToken(web3, networkId, dispatch)
	loadExchange(web3, networkId, dispatch)
}

const App = () => {
	const dispatch = useDispatch()
	useEffect(() => {
		loadBlockchainData(dispatch).then()
	}, [dispatch])

	const { web3 } = useSelector((state) => state)
	useEffect(() => {
		console.log(web3)
		if (web3.account) {
			console.log(web3.account)
		}
	}, [web3])

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

export default App
