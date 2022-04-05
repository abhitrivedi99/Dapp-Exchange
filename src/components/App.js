/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { loadWeb3, loadNetworkId, loadToken, loadExchange, loadAccount, loadNetwork } from '../store/interactions'
import Navbar from './Navbar'
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

	const { account } = useSelector((state) => state.web3)

	return (
		<div>
			<Navbar address={account} />

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
