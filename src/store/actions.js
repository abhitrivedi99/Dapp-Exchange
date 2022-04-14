export const web3Loaded = (connection) => {
	return {
		type: 'WEB3_LOADED',
		connection,
	}
}

export const web3AccountLoaded = (account) => {
	return {
		type: 'WEB3_ACCOUNT_LOADED',
		account,
	}
}

export const web3NetworkLoaded = (network) => {
	return {
		type: 'WEB3_NETWORK_LOADED',
		network,
	}
}

export const web3NetworkIdLoaded = (id) => {
	return {
		type: 'WEB3_NETWORK_ID_LOADED',
		id,
	}
}

export const tokenLoaded = (contract) => {
	return {
		type: 'TOKEN_LOADED',
		contract,
	}
}

export const exchangeLoaded = (contract) => {
	return {
		type: 'EXCHANGE_LOADED',
		contract,
	}
}

export const cancelledOrdersLoaded = (cancelledOrders) => {
	return {
		type: 'CANCELLED_ORDERS_LOADED',
		orders: cancelledOrders,
	}
}

export const filledOrdersLoaded = (filledOrders) => {
	return {
		type: 'FILLED_ORDERS_LOADED',
		orders: filledOrders,
	}
}

export const allOrdersLoaded = (allOrders) => {
	return {
		type: 'ALL_ORDERS_LOADED',
		orders: allOrders,
	}
}

export const myFilledOrdersLoaded = (account, orders) => {
	return {
		type: 'MY_FILLED_ORDERS_LOADED',
		payload: {
			account,
			orders,
		},
	}
}

export const myOpenOrdersLoaded = (account, orders) => {
	return {
		type: 'MY_OPEN_ORDERS_LOADED',
		payload: {
			account,
			orders,
		},
	}
}
