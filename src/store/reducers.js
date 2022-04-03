import { combineReducers } from 'redux'

const web3 = (state = {}, action) => {
	switch (action.type) {
		case 'WEB3_LOADED':
			return { ...state, connection: action.connection }
		default:
			return state
	}
}

const rootReducer = combineReducers({
	web3,
})

export default rootReducer
