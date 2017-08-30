const initialState = {
	user: null,
	loggedIn: false
};


export const USER_LOGIN = 'USER_LOGIN';
export const USER_LOGOUT = 'USER_LOGOUT';

const userLogin = user => ({
	type: USER_LOGIN,
	payload: user
});

const userLogout = () => ({
	type: USER_LOGOUT
})

export const actions = {
	userLogin,
	userLogout
};

const actionHandler = {
	[USER_LOGIN]: (state, action) => ({ ...state, user: action.payload, loggedIn: true }),
	[USER_LOGOUT]: state => ({ ...state, user: null, loggedIn: false })
};

const authReducer = (state = initialState, action) => {
	const handler = actionHandler[action.type];
	return handler ? handler(state, action) : state;
}

export default authReducer;