import React from 'react'
import { useSelector } from 'react-redux'
import Spinner from './Spinner'

const Trades = () => {
	const { filledOrder } = useSelector((state) => state.exchange)

	return (
		<div className="vertical">
			<div className="card bg-dark text-white">
				<div className="card-header">Trades</div>
				<div className="card-body">
					<table className="table table-dark table-sm small">
						<thead>
							<tr>
								{/* <th scope="col">#</th> */}
								<th scope="col">Time</th>
								<th scope="col">DAPP</th>
								<th scope="col">DAPP/ETH</th>
							</tr>
						</thead>
						{filledOrder?.loaded ? (
							<>
								<tbody>
									{filledOrder?.data?.length > 0 &&
										filledOrder.data.map((order, index) => {
											return (
												<tr className={`order-${order.id}`} key={index}>
													<td className="text-muted">{order.formattedTimestamp}</td>
													<td>{order.tokenAmount}</td>
													<td className={`text-${order.tokenPriceClass}`}>{order.tokenPrice}</td>
												</tr>
											)
										})}
								</tbody>
							</>
						) : (
							<Spinner type="table" />
						)}
					</table>
				</div>
			</div>
		</div>
	)
}

export default Trades
