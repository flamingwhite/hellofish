import { combineReducers } from 'redux'
import locationReducer from './location';
import contactsReducer from '../routes/Contacts/contactsReducer';
import authReducer from './authReducer';

export const makeRootReducer = (asyncReducers) => {
  return combineReducers({
	location: locationReducer,
	contactChunk: contactsReducer,
	auth: authReducer,
    ...asyncReducers
  })
}

export const injectReducer = (store, { key, reducer }) => {
  if (Object.hasOwnProperty.call(store.asyncReducers, key)) return

  store.asyncReducers[key] = reducer
  store.replaceReducer(makeRootReducer(store.asyncReducers))
}

export default makeRootReducer
