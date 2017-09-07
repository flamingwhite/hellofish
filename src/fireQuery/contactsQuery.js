const {
	getFireDB
} = require('./fireConnection');
const {
	fireRef
} = require('../lib/firedog');
const contactsRef = fireRef(getFireDB().ref('contacts/'));
import R from 'ramda';

// import {
// 	tagSeparator
// } from '../properties/constants';

// const prepareTagKeys = contact => ({
// 	...contact,
// 	tagKeys: contact.tagKeys ? contact.tagKeys.join(tagSeparator) : ''
// });

export const contactsList = () =>
	contactsRef.arrayStream()
	.map(arr => arr.map(ct => ({
		...ct,
		// tagKeys: ct.tagKeys ? ct.tagKeys.split(tagSeparator).filter(x => x) : [],
		tagKeys: !R.is(Object, ct.tagKeys) ? {} : ct.tagKeys
	})));
export const updateContact = contact => contactsRef.updateById(contact._id, contact);
export const updateContactById = (id, contact) => contactsRef.updateById(id, contact);
export const createContact = contact => contactsRef.push(contact);
export const deleteContactById = id => contactsRef.removeById(id);
