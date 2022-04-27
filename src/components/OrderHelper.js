import moment from 'moment'
import { reject, groupBy, get, maxBy, minBy } from 'lodash'
import { ETHER_ADDRESS, ether, tokens, GREEN, RED, BUY, SELL } from '../helper'

const decorateOrder = (order) => {
	let etherAmount, tokenAmount

	if (order.tokenGive === ETHER_ADDRESS) {
		etherAmount = ether(order.amountGive)
		tokenAmount = tokens(order.amountGet)
	} else {
		etherAmount = ether(order.amountGet)
		tokenAmount = tokens(order.amountGive)
	}

	const precision = 100000
	let tokenPrice = etherAmount / tokenAmount
	tokenPrice = Math.round(tokenPrice * precision) / precision

	const formattedTimestamp = moment.unix(order.timestamp).format('h:mm:ss a M/D')

	return { etherAmount, tokenAmount, tokenPrice, formattedTimestamp, ...order }
}

const decorateFilledorder = (order, previousOrder) => {
	return { ...order, tokenPriceClass: tokenPriceClass(order.tokenPrice, order.id, previousOrder) }
}

const tokenPriceClass = (price, orderId, previousOrder) => {
	if (previousOrder?.id === orderId) {
		return GREEN
	}
	// green: if price is higher than previous
	// red: if price is lower than previous
	if (previousOrder?.tokenPrice <= price) {
		return GREEN
	} else {
		return RED
	}
}

const decoratedFilledOrders = (orders) => {
	let previousOrder = orders[0]
	return orders.map((order) => {
		order = decorateOrder(order)
		order = decorateFilledorder(order, previousOrder)
		previousOrder = order

		return order
	})
}

const openOrders = (orders, filled, cancelled) => {
	const all = allOrders(orders)

	const openOrders = reject(all, (order) => {
		const orderFilled = filled.some((o) => o.id === order.id)
		const orderCancelled = cancelled.some((o) => o.id === order.id)

		return orderCancelled || orderFilled
	})

	return openOrders
}

const decorateOrderBookOrder = (order) => {
	const orderType = order.tokenGive === ETHER_ADDRESS ? BUY : SELL
	const orderTypeClass = orderType === BUY ? GREEN : RED
	const orderFillClass = orderType === BUY ? SELL : BUY

	return { ...order, orderType, orderTypeClass, orderFillClass }
}

const decorateMyFilledOrders = (orders, account) => {
	return orders.map((order) => {
		order = decorateOrder(order)
		order = decorateMyFilledOrder(order, account)
		return order
	})
}

const decorateMyFilledOrder = (order, account) => {
	const myOrder = order.user === account

	let orderType = order.tokenGive === ETHER_ADDRESS ? SELL : BUY

	if (myOrder) {
		orderType = order.tokenGive === ETHER_ADDRESS ? BUY : SELL
	}

	const orderTypeClass = orderType === BUY ? GREEN : RED
	const orderSign = orderType === BUY ? '+' : '-'

	return { ...order, orderType, orderTypeClass, orderSign }
}

const decorateMyOpenOrders = (orders) => {
	return orders.map((order) => {
		order = decorateOrder(order)
		order = decorateMyOpenOrder(order)
		return order
	})
}

const decorateMyOpenOrder = (order) => {
	const orderType = order.tokenGive === ETHER_ADDRESS ? BUY : SELL
	const orderTypeClass = orderType === BUY ? GREEN : RED

	return {
		...order,
		orderType,
		orderTypeClass,
	}
}

export const filledOrders = (orders) => {
	orders = orders.sort((a, b) => a.timestamp - b.timestamp)

	orders = decoratedFilledOrders(orders)
	orders = orders.sort((a, b) => b.timestamp - a.timestamp)

	return orders
}

export const cancelledOrders = (orders) => {
	orders = orders.sort((a, b) => b.timestamp - a.timestamp)
	return orders.map((order) => decorateOrder(order))
}

export const allOrders = (orders) => {
	orders = orders.sort((a, b) => b.timestamp - a.timestamp)
	return orders.map((order) => decorateOrder(order))
}

export const orderBook = (orders, filled, cancelled) => {
	orders = openOrders(orders, filled, cancelled)
	orders = orders.map((order) => decorateOrderBookOrder(order))
	// Grouping by order type
	orders = groupBy(orders, 'orderType')

	// buy orders
	let buyOrders = get(orders, BUY, [])
	buyOrders = buyOrders.sort((a, b) => b.tokenPrice - a.tokenPrice)

	// sell orders
	let sellOrders = get(orders, SELL, [])
	sellOrders = sellOrders.sort((a, b) => b.tokenPrice - a.tokenPrice)
	return { ...orders, buyOrders, sellOrders }
}

export const myFilledOrders = (orders, account) => {
	orders = orders.filter((order) => order.user === account || order.userFill === account)

	orders = decorateMyFilledOrders(orders, account)
	orders = orders.sort((a, b) => b.timestamp - a.timestamp)

	return orders
}

export const myOpenOrdersLoaded = (orders, account) => {
	// Filter orders created by current account
	orders = orders.filter((order) => order.user === account)
	// Decorate orders - add display attributes
	orders = decorateMyOpenOrders(orders)
	// Sort orders by date descending
	orders = orders.sort((a, b) => b.timestamp - a.timestamp)
	return orders
}

export const priceChartLoaded = (orders) => {
	orders = orders.sort((a, b) => a.timestamp - b.timestamp)
	orders = orders.map((order) => decorateOrder(order))

	let lastOrder, secondLastOrder
	;[secondLastOrder, lastOrder] = orders.slice(orders.length - 2, orders.length)

	const series = [
		{
			data: buildGraphData(orders),
		},
	]

	const lastPrice = lastOrder.tokenPrice || 0
	const secondLastPrice = secondLastOrder.tokenPrice || 0
	const lastPriceChange = lastPrice >= secondLastPrice ? '+' : '-'

	return {
		series,
		lastPrice,
		lastPriceChange,
	}
}

const buildGraphData = (orders) => {
	// Group the orders by hour for the graph
	orders = groupBy(orders, (o) => moment.unix(o.timestamp).startOf('hour').format())

	// Get each hour where data exists
	const hours = Object.keys(orders)

	const graphData = hours.map((hour) => {
		// Fetch all the orders from current hour
		const group = orders[hour]

		// Calculate price values - open, high, low, close
		const open = group[0]
		const close = group[group.length - 1]
		const high = maxBy(group, 'tokenPrice')
		const low = minBy(group, 'tokenPrice')

		return {
			x: new Date(hour),
			y: [open.tokenPrice, high.tokenPrice, low.tokenPrice, close.tokenPrice],
		}
	})

	return graphData
}
