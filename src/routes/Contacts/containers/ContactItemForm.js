import {
	connect
} from 'react-redux';
import React, {Component} from 'react';
import {Button} from 'antd';
import LabelFieldSet from '../../../commonCmps/LabelFieldSet';
import validator from 'validator';
import R from 'ramda';
import simpleForm from '../../../lib/simpleForm';


const validation = ({ name='', email='', phone='', address='' }) => {

	const err = {
		email: validator.isEmail(email)? null: 'Email is not valid',
		phone: validator.isMobilePhone(phone, 'any')? null: 'Phone is not valid',
	};
	console.log('errs ', err);
	return err;
};



@connect()
@simpleForm({
	fields: ['name', 'email', 'phone', 'company', 'address'],
	validate: validation
})
class ContactItemForm extends Component {
	constructor(props) {
		super(props);
		this.submit = this.submit.bind(this);
	}
	submit() {


	}
	render() {
		console.log('fields', this.props);
		const {fields, name, phone, email, address, company, hasSubmitted, okText='Ok', cancelText='Cancel', onOk, onCancel} = this.props;

		return (
			<div>
				{JSON.stringify(this.props)}	
				<LabelFieldSet label="Name" err={(hasSubmitted||name.touched)&&name.error}>
					<input className="form-control" {...name}/>
				</LabelFieldSet>
				<LabelFieldSet label="email" err={(hasSubmitted||email.touched)&&email.error}>
					<input className="form-control" {...email}/>
				</LabelFieldSet>
				<LabelFieldSet label="Phone" err={(hasSubmitted||phone.touched)&&phone.error}>
					<input className="form-control" {...phone}/>
				</LabelFieldSet>
				<LabelFieldSet label="Address" err={(hasSubmitted||address.touched)&&address.error}>
					<input className="form-control" {...address}/>
				</LabelFieldSet>
				<LabelFieldSet label="Company" err={(hasSubmitted||company.touched)&&company.error}>
					<input className="form-control" {...company}/>
				</LabelFieldSet>
				<Button type="primary" onClick={() => onOk(fields)}>{okText}</Button>
				<Button type="default" onClick={onCancel}>{cancelText}</Button>

			</div>
		)

	}
}
export default ContactItemForm;
