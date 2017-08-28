import { combineReducers } from 'redux'
import locationReducer from './location';
import contactsReducer from '../routes/Contacts/contactsReducer';
import {reducer as formReducer} from 'redux-form';

export const makeRootReducer = (asyncReducers) => {
  return combineReducers({
	location: locationReducer,
	contactChunk: contactsReducer,
	form: formReducer,
    ...asyncReducers
  })
}

export const injectReducer = (store, { key, reducer }) => {
  if (Object.hasOwnProperty.call(store.asyncReducers, key)) return

  store.asyncReducers[key] = reducer
  store.replaceReducer(makeRootReducer(store.asyncReducers))
}

export default makeRootReducer
