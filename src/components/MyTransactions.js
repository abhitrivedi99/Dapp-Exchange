import React, { useEffect } from 'react';
import { Tabs, Tab } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { myFilledOrdersLoaded, myOpenOrdersLoaded } from '../store/actions';
import { cancelOrder } from '../store/interactions';
import Spinner from './Spinner';

const MyTransaction = () => {
	const dispatch = useDispatch();

	const { web3, exchange } = useSelector((state) => state);

	useEffect(() => {
		if (web3?.account && exchange?.filledOrder?.loaded && !exchange?.myFilledOrder?.loaded)
			dispatch(myFilledOrdersLoaded(web3.account, exchange?.filledOrder?.data));
		if (web3?.account && exchange?.allOrder?.loaded && !exchange?.myOpenedOrder?.loaded)
			dispatch(myOpenOrdersLoaded(web3.account, [...exchange?.allOrder?.data?.buyOrders, ...exchange?.allOrder?.data?.sellOrders]));
	}, [web3.account, exchange, dispatch]);

	const renderMYFilledOrders = (orders) => {
		return (
			<tbody>
				{orders.map((order) => {
					return (
						<tr key={order.id}>
							<td className="text-muted">{order.formattedTimestamp}</td>
							<td className={`text-${order.orderTypeClass}`}>
								{order.orderSign}
								{order.tokenAmount}
							</td>
							<td className={`text-${order.orderTypeClass}`}>{order.tokenPrice}</td>
						</tr>
					);
				})}
			</tbody>
		);
	};

	const renderMYOpenedOrders = (orders) => {
		return (
			<tbody>
				{orders.map((order) => {
					return (
						<tr key={order.id}>
							<td className={`text-${order.orderTypeClass}`}>{order.tokenAmount}</td>
							<td className={`text-${order.orderTypeClass}`}>{order.tokenPrice}</td>
							<td
								className="text-muted cancel-order"
								onClick={(e) => {
									cancelOrder(dispatch, exchange, order, web3.account);
								}}
							>
								X
							</td>
						</tr>
					);
				})}
			</tbody>
		);
	};

	return (
		<div className="card bg-dark text-white">
			<div className="card-header">My Transactions</div>
			<div className="card-body">
				<Tabs defaultActiveKey="trades" className="bg-dark text-white">
					<Tab eventKey="trades" title="Trades" className="bg-dark">
						<table className="table table-dark table-sm small">
							<thead>
								<tr>
									<th>Time</th>
									<th>DAPP</th>
									<th>DAPP/ETH</th>
								</tr>
							</thead>
							{exchange?.myFilledOrder?.loaded ? (
								renderMYFilledOrders(exchange?.myFilledOrder?.data)
							) : (
								<Spinner type="table" />
							)}
						</table>
					</Tab>
					<Tab eventKey="orders" title="Orders" className="bg-dark">
						<table className="table table-dark table-sm small">
							<thead>
								<tr>
									<th>Amount</th>
									<th>DAPP</th>
									<th>Cancel</th>
								</tr>
							</thead>
							{exchange?.myOpenedOrder?.loaded && !exchange?.orderCancelling ? (
								renderMYOpenedOrders(exchange?.myOpenedOrder?.data)
							) : (
								<Spinner type="table" />
							)}
						</table>
					</Tab>
				</Tabs>
			</div>
		</div>
	);
};

export default MyTransaction;
