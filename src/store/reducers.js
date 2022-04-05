import { combineReducers } from 'redux'

const web3 = (state = {}, action) => {
	switch (action.type) {
		case 'WEB3_LOADED':
			return { ...state, connection: action.connection }
		case 'WEB3_ACCOUNT_LOADED':
			return { ...state, account: action.account }
		case 'WEB3_NETWORK_LOADED':
			return { ...state, network: action.network }
		case 'WEB3_NETWORK_ID_LOADED':
			return { ...state, networkId: action.id }
		case 'WEB3_TOKEN_LOADED':
			return { ...state, token: action.token }
		default:
			return state
	}
}

const token = (state = {}, action) => {
	switch (action.type) {
		case 'TOKEN_LOADED':
			return { ...state, loaded: true, contract: action.contract }
		default:
			return state
	}
}

const exchange = (state = {}, action) => {
	switch (action.type) {
		case 'EXCHANGE_LOADED':
			return { ...state, loaded: true, contract: action.contract }
		default:
			return state
	}
}

const rootReducer = combineReducers({
	web3,
	token,
	exchange,
})

export default rootReducer
