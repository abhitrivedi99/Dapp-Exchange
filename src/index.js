import React from 'react'
import { render } from 'react-dom'
import App from './components/App'
import 'bootstrap/dist/css/bootstrap.css'
import * as serviceWorker from './serviceWorker'
import { Provider } from 'react-redux'
import configureStore from './store/configureStore'

render(
	<Provider store={configureStore()}>
		<App />
	</Provider>,

	document.getElementById('root'),
)

serviceWorker.unregister()
