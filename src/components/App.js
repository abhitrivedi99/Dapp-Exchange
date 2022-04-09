/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { loadWeb3, loadNetworkId, loadToken, loadExchange, loadAccount, loadNetwork } from '../store/interactions'
import Navbar from './Navbar'
import Content from './Content'
import './App.css'

const loadBlockchainData = async (dispatch) => {
	const web3 = loadWeb3(dispatch)
	loadNetwork(web3, dispatch)

	await loadAccount(web3, dispatch)

	const networkId = await loadNetworkId(web3, dispatch)

	const token = await loadToken(web3, networkId, dispatch)
	if (!token) window.alert('Contract not deployed to the current network. Please select another network from Metamask.')
	const exchange = await loadExchange(web3, networkId, dispatch)
	if (!exchange) window.alert('Contract not deployed to the current network. Please select another network from Metamask.')
}

const App = () => {
	const dispatch = useDispatch()
	useEffect(() => {
		loadBlockchainData(dispatch).then()
	}, [dispatch])

	const { web3, token, exchange } = useSelector((state) => state)

	const isContractLoaded = () => {
		return token.loaded && exchange.loaded ? true : false
	}

	return (
		<div>
			<Navbar address={web3.account} />
			{isContractLoaded() ? <Content /> : <div className="content"></div>}
		</div>
	)
}

export default App
