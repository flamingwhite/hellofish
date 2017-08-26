const initialState = {
	contacts: []
};

export const FETCH_CONTACT = 'FETCH_CONTACT';
export const ADD_CONTACT = 'ADD_CONTACT';
export const UPDATE_CONTACT = 'UPDATE_CONTACT';

const fetchContacts = () => {
	return {
		type: FETCH_CONTACT,
		payload: [
			{
				name: 'truedata',
				email: 'abc@gmail.com',
				phone: '4239954333',
				address: '2505 Timbercreek Cir, GA',
				company: 'Geniune Parts',
				comments: 'hello how ar eyou'
			},
			{
				name: 'eddie',
				age: '20'
			},
			{
				name: 'what',
				age: '20'
			},
			{
				name: 'eddie',
				age: '20'
			},
			{
				name: 'what',
				age: '20'
			},
			{
				name: 'eddie',
				age: '20'
			},
			{
				name: 'what',
				age: '20'
			},
			{
				name: 'eddie',
				age: '20'
			},
			{
				name: 'what',
				age: '20'
			},
			{
				name: 'miao',
				age: '20'
			},
			{
				name: 'let',
				age: '20'
			},
			{
				name: 'hello',
				age: '20'
			},
			{
				name: 'yong',
				age: '20'
			}
		]
	}
};

const addContact = contact => {

};

const updateContact = contact => {

};

export const actions = {
	fetchContacts,
	addContact,
	updateContact
};

const actionHandler = {
	[FETCH_CONTACT]: (state, action) => ({...state, contacts: action.payload})
}


const contactsReducer = (state = initialState, action) => {
	const handler = actionHandler[action.type];
	return handler ? handler(state, action) : state;
}

export default contactsReducer;