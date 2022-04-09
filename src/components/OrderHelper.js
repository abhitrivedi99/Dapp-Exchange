import moment from 'moment'
import { ETHER_ADDRESS, ether, tokens, GREEN, RED } from '../helper'

const decorateOrder = (order) => {
	let etherAmount, tokenAmount
	const { user, userFill, timestamp, id } = order

	if (order.tokenGive === ETHER_ADDRESS) {
		etherAmount = ether(order.amountGive)
		tokenAmount = tokens(order.amountGet)
	} else {
		etherAmount = ether(order.amountGet)
		tokenAmount = tokens(order.amountGive)
	}

	const tokenPrice = Math.round((etherAmount / tokenAmount) * 10000) / 10000

	const formattedTimestamp = moment.unix(order.timestamp).format('h:mm:ss a M/D')

	return { user, userFill, etherAmount, tokenAmount, tokenPrice, formattedTimestamp, timestamp, id }
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

export const filledOrders = (orders) => {
	orders = orders.sort((a, b) => a.timestamp - b.timestamp)

	orders = decoratedFilledOrders(orders)

	orders = orders.sort((a, b) => b.timestamp - a.timestamp)
	return orders
}
