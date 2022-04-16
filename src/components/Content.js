/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { loadAllOrders } from '../store/interactions'
import Trades from './Trades'
import OrderBook from './OrderBook'
import Spinner from './Spinner'
import MyTransaction from './MyTransactions'
import PriceChart from './PriceChart'

const Content = () => {
	const dispatch = useDispatch()
	const { loaded, contract } = useSelector((state) => state.exchange)

	const loadBlockchainData = useCallback(
		async (dispatch) => {
			if (loaded) await loadAllOrders(contract, dispatch)
		},
		[contract, loaded],
	)

	useEffect(() => {
		loadBlockchainData(dispatch)
	}, [loadBlockchainData, dispatch])

	return (
		<div className="content">
			<div className="vertical-split">
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
			{loaded ? <OrderBook /> : <Spinner />}
			<div className="vertical-split">
				<PriceChart />
				<MyTransaction />
			</div>
			{loaded ? <Trades /> : <Spinner />}
		</div>
	)
}

export default Content
