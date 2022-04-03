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
