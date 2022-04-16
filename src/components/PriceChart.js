import React, { useEffect } from 'react'
import Chart from 'react-apexcharts'
import { useSelector, useDispatch } from 'react-redux'
import Spinner from './Spinner'
import { chartOptions } from '../PriceChart.config'
import { priceChartLoaded } from '../store/actions'

const priceSymbol = (priceChange) => {
	let output = <span className="text-danger">&#9660;</span>

	if (priceChange === '+') {
		output = <span className="text-success">&#9650;</span>
	}

	return output
}

const renderPriceChart = (data) => {
	return (
		<div className="price-chart">
			<div className="price">
				<h4>
					DAPP/ETH &nbsp;{priceSymbol(data.lastPriceChange)}
					&nbsp;{data.lastPrice}
				</h4>
			</div>
			<Chart options={chartOptions} series={data.series} type="candlestick" width="100%" hight="100%" />
		</div>
	)
}

const PriceChart = () => {
	const dispatch = useDispatch()

	const { exchange } = useSelector((state) => state)

	useEffect(() => {
		try {
			if (exchange?.loaded && exchange?.filledOrder?.loaded && !exchange?.priceChart?.loaded) {
				dispatch(priceChartLoaded(exchange.filledOrder.data))
			}
		} catch (err) {
			console.log(err)
		}
	}, [exchange.filledOrder, exchange.priceChart, dispatch, exchange.loaded])

	return (
		<div className="card bg-dark text-white">
			<div className="card-header">Price chart</div>
			<div className="card-body">{exchange?.priceChart?.loaded ? renderPriceChart(exchange.priceChart.data) : <Spinner />}</div>
		</div>
	)
}

export default PriceChart
