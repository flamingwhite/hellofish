const initialState = {
	contacts: []
};


export const FETCH_CONTACT = 'FETCH_CONTACT';

const fetchContacts = payload => {
	return {
		type: FETCH_CONTACT,
		payload
	}
};


export const actions = {
	fetchContacts,
};

const actionHandler = {
	[FETCH_CONTACT]: (state, action) => ({...state, contacts: action.payload})
}


const contactsReducer = (state = initialState, action) => {
	const handler = actionHandler[action.type];
	return handler ? handler(state, action) : state;
}

export default contactsReducer;