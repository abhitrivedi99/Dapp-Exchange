import { combineReducers } from 'redux'
import { filledOrders, cancelledOrders, orderBook, myFilledOrders, myOpenOrdersLoaded, priceChartLoaded } from '../components/OrderHelper'

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
		case 'CANCELLED_ORDERS_LOADED':
			return { ...state, cancelledOrder: { loaded: true, data: cancelledOrders(action.orders) } }
		case 'FILLED_ORDERS_LOADED':
			return { ...state, filledOrder: { loaded: true, data: filledOrders(action.orders) } }
		case 'ALL_ORDERS_LOADED':
			return {
				...state,
				allOrder: { loaded: true, data: orderBook(action.orders, state.filledOrder.data, state.cancelledOrder.data) },
			}
		case 'MY_FILLED_ORDERS_LOADED':
			return {
				...state,
				myFilledOrder: { loaded: true, data: myFilledOrders(action.payload.orders, action.payload.account) },
			}
		case 'MY_OPEN_ORDERS_LOADED':
			return {
				...state,
				myOpenedOrder: { loaded: true, data: myOpenOrdersLoaded(action.payload.orders, action.payload.account) },
			}
		case 'PRICE_CHART_LOADED':
			return {
				...state,
				priceChart: { loaded: true, data: priceChartLoaded(action.orders) },
			}
		case 'ORDER_CANCELLING': {
			return { ...state, orderCancelling: true }
		}
		case 'ORDER_CANCELLED': {
			return {
				...state,
				orderCancelling: false,
				cancelledOrder: {
					loaded: true,
					data: [...state.cancelledOrder.data, action.order],
				},
			}
		}
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
