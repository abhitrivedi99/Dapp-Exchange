import Web3 from 'web3';
import {
	web3Loaded,
	web3AccountLoaded,
	web3NetworkIdLoaded,
	web3NetworkLoaded,
	tokenLoaded,
	exchangeLoaded,
	cancelledOrdersLoaded,
	filledOrdersLoaded,
	allOrdersLoaded,
	orderCancelling,
	orderCancelled,
} from './actions';
import Token from '../abis/Token.json';
import Exchange from '../abis/Exchange.json';

export const loadWeb3 = (dispatch) => {
	if (typeof window.ethereum !== 'undefined') {
		const web3 = new Web3(window.ethereum);
		dispatch(web3Loaded(web3));
		return web3;
	} else {
		window.alert('Please install MetaMask');
		window.location.assign('https://metamask.io/');
	}
};

export const loadAccount = async (web3, dispatch) => {
	const accounts = await web3.eth.getAccounts();
	const account = accounts[0];
	dispatch(web3AccountLoaded(account));
	return account;
};

export const loadNetwork = async (web3, dispatch) => {
	const network = await web3.eth.net.getNetworkType();
	dispatch(web3NetworkLoaded(network));
	return network;
};

export const loadNetworkId = async (web3, dispatch) => {
	const networkId = await web3.eth.net.getId();
	dispatch(web3NetworkIdLoaded(networkId));
	return networkId;
};

export const loadToken = (web3, networkId, dispatch) => {
	try {
		const token = new web3.eth.Contract(Token.abi, Token.networks[networkId].address);
		dispatch(tokenLoaded(token));
		return token;
	} catch (e) {
		console.log('Contract not deployed to the current network. Please select another network from Metamask.');
		return null;
	}
};

export const loadExchange = (web3, networkId, dispatch) => {
	try {
		const exchange = new web3.eth.Contract(Exchange.abi, Exchange.networks[networkId].address);
		dispatch(exchangeLoaded(exchange));
		return exchange;
	} catch (e) {
		console.log('Contract not deployed to the current network. Please select another network from Metamask.');
		return null;
	}
};

export const loadAllOrders = async (exchange, dispatch) => {
	// Fetch cancelled orders from "Cancel" event
	const cancelStream = await exchange.getPastEvents('Cancel', { fromBlock: 0, toBlock: 'latest' });

	// Format orders
	const cancelledOrders = cancelStream.map((event) => event.returnValues);

	// Add cancelled orders to redux
	dispatch(cancelledOrdersLoaded(cancelledOrders));

	// Fetch filled orders from "Trade" event
	const tradeStream = await exchange.getPastEvents('Trade', { fromBlock: 0, toBlock: 'latest' });
	const filledOrders = tradeStream.map((event) => event.returnValues);
	dispatch(filledOrdersLoaded(filledOrders));

	// Fetch all orders from "Order" event
	const orderStream = await exchange.getPastEvents('Order', { fromBlock: 0, toBlock: 'latest' });
	const allOrders = orderStream.map((event) => event.returnValues);
	dispatch(allOrdersLoaded(allOrders));
};

export const cancelOrder = (dispatch, exchange, order, account) => {
	exchange.contract.methods
		.cancelOrder(order.id)
		.send({ from: account })
		.on('transactionHash', (hash) => {
			console.log(hash);
			dispatch(orderCancelling());
		})
		.on('error', (error) => {
			console.log(error);
			window.alert('Error occured');
		});
};

export const subscribeToEvents = async (dispatch, exchange) => {
	await exchange.events.Cancel({}, (err, event) => {
		dispatch(orderCancelled(event.returnValues));
		// loadAllOrders(exchange, dispatch);
	});
};
