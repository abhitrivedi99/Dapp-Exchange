import { createStore, applyMiddleware, compose } from 'redux'
import { createLogger } from 'redux-logger'
import Reducer from './reducers'

const loggerMiddleware = createLogger('logger')
const middleware = []

const composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

const configureStore = (preoadedState) =>
	createStore(Reducer, preoadedState, composeEnhancer(applyMiddleware(...middleware, loggerMiddleware)))

export default configureStore
