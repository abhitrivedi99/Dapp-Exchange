import React from 'react'
import { useSelector } from 'react-redux'
import Spinner from './Spinner'

const OrderBook = () => {
	const { allOrder } = useSelector((state) => state.exchange)

	const renderOrder = (order) => {
		return (
			<tr key={order.id}>
				<td>{order.tokenAmount}</td>
				<td className={`text-${order.orderTypeClass}`}>{order.tokenPrice}</td>
				<td>{order.etherAmount}</td>
			</tr>
		)
	}

	const showOrderBook = (orders) => {
		return (
			<tbody>
				{orders.sellOrders.map((order) => renderOrder(order))}
				<tr>
					<th>DAPP</th>
					<th>DAPP/ETH</th>
					<th>ETH</th>
				</tr>
				{orders.buyOrders.map((order) => renderOrder(order))}
			</tbody>
		)
	}

	return (
		<div className="vertical">
			<div className="card bg-dark text-white">
				<div className="card-header">Order Book</div>
				<div className="card-body">
					<table className="table table-dark table-sm small">
						{allOrder?.loaded ? showOrderBook(allOrder.data) : <Spinner type="table" />}
					</table>
				</div>
			</div>
		</div>
	)
}

export default OrderBook
