import React, {
	Component
} from 'react';
import {
	connect
} from 'react-redux';
import { initialize } from 'redux-form';
import {
	curry
} from 'ramda';

const RichObj = obj => obj ? obj : {};

const getFormValues = curry((form, state) => (RichObj(state.form[form])).values);


const reduxFormValues = (config) => Cmp => {
	const { form, propName = 'formValues'} = config;


	@connect(
		state => ({
			[propName]: getFormValues(form, state)
		})
	)
	class Wrapper extends Component {
		constructor(props) {
			super(props);
			const { dispatch, initialValues } = this.props;
			if (initialValues) {
				console.log('Initvalues', initialValues);

				dispatch(initialize(form, initialValues));
			}
		}
		render() {
			return ( <Cmp { ...this.props } />);
		}
	}

	return Wrapper;
}

export {
	getFormValues,
	reduxFormValues
};