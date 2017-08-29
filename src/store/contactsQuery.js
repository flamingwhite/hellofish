const { getFireDB } = require('./fireConnection');
const {fireRef} = require('../lib/firedog');

const contactsRef = fireRef(getFireDB().ref('users/'));

export const contactsList = () => contactsRef.arrayStream();
export const updateContact = contact => contactsRef.updateById(contact._id, contact);
export const updateContactById = (id, contact) => contactsRef.updateById(id, contact);
export const createContact = contact => contactsRef.push(contact);