const {
	getFireDB
} = require('./fireConnection');
const {
	fireRef
} = require('../lib/firedog');
import R from 'ramda';
const contactsRef = fireRef(getFireDB().ref('contacts/'));


export const getContactsRef = () => getFireDB().ref('contacts/');
export const contactsList = () =>
	contactsRef.arrayStream()
	.map(arr => arr.map(ct => ({
		...ct,
		tagKeys: !R.is(Object, ct.tagKeys) ? {} : ct.tagKeys
	})));
export const updateContact = contact => contactsRef.updateById(contact._id, contact);
export const updateContactById = (id, contact) => contactsRef.updateById(id, contact);
export const createContact = contact => contactsRef.push(contact);
export const deleteContactById = id => contactsRef.removeById(id);
