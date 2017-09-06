import {
	applyMiddleware,
	compose,
	createStore as createReduxStore
} from 'redux'
import thunk from 'redux-thunk'
import {
	browserHistory
} from 'react-router'
import makeRootReducer from './reducers'
import {
	updateLocation
} from './location';
import {
	contactsList
} from '../fireQuery/contactsQuery';
import {
	contactTagList	
} from '../fireQuery/tagsQuery';
import {
	getFirebase
} from '../fireQuery/fireConnection';
import {
	actions as authActions
} from './authReducer';
import {actions as tagAction} from './tagsReducer';

const createStore = (initialState = {}) => {
	// ======================================================
	// Middleware Configuration
	// ======================================================
	const middleware = [thunk]

	// ======================================================
	// Store Enhancers
	// ======================================================
	const enhancers = []
	let composeEnhancers = compose

	if (__DEV__) {
		if (typeof window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ === 'function') {
			composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
		}
	}

	// ======================================================
	// Store Instantiation and HMR Setup
	// ======================================================
	const store = createReduxStore(
		makeRootReducer(),
		initialState,
		composeEnhancers(
			applyMiddleware(...middleware),
			...enhancers
		)
	)
	store.asyncReducers = {}

	// To unsubscribe, invoke `store.unsubscribeHistory()` anytime
	store.unsubscribeHistory = browserHistory.listen(updateLocation(store));

	//hook firebase contact list with redux
	//   contactsList().subscribe(list => store.dispatch({ type: 'FETCH_CONTACT', payload: list }));

	const contactListSub = contactsList();
	const contactTagListSub = contactTagList();


	//listen to user login info
	getFirebase().auth().onAuthStateChanged(user => {
		if (user) {
			console.log('user logged in', user);
			store.dispatch(authActions.userLogin(user))
			contactListSub.subscribe(list => store.dispatch({
				type: 'FETCH_CONTACT',
				payload: list
			}));
			contactTagListSub.subscribe(tags => store.dispatch(tagAction.fetchTags(tags) ));
		} else {
			console.log('user logged out', user);
			store.dispatch(authActions.userLogout());
		}

	})




	if (module.hot) {
		module.hot.accept('./reducers', () => {
			const reducers = require('./reducers').default
			store.replaceReducer(reducers(store.asyncReducers))
		})
	}

	return store
}

export default createStore
