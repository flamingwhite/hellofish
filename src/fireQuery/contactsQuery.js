const {
	getFireDB
} = require('./fireConnection');
const {
	fireRef
} = require('../lib/firedog');
const contactsRef = fireRef(getFireDB().ref('contacts/'));

import {
	tagSeparator
} from '../properties/constants';

const prepareTagKeys = contact => ({
	...contact,
	tagKeys: contact.tagKeys ? contact.tagKeys.join(tagSeparator) : ''
});

export const contactsList = () =>
	contactsRef.arrayStream()
	.map(arr => arr.map(ct => ({
		...ct,
		tagKeys: ct.tagKeys?  ct.tagKeys.split(tagSeparator).filter(x=>x): []
	})));
export const updateContact = contact => contactsRef.updateById(contact._id, prepareTagKeys(contact));
export const updateContactById = (id, contact) => contactsRef.updateById(id, prepareTagKeys(contact));
export const createContact = contact => contactsRef.push(prepareTagKeys(contact));
export const deleteContactById = id => contactsRef.removeById(id);
