import {
	connect
} from 'react-redux';
import React, {Component} from 'react';
import {Button, message, Popconfirm} from 'antd';
import LabelFieldSet from '../../../commonCmps/LabelFieldSet';
import validator from 'validator';
import simpleForm from '../../../lib/simpleForm';
import ImageUploader from '../../../commonCmps/ImageUploader';
import {getBusinessCardRef} from '../../../store/fireConnection';
import createUUID from '../../../lib/uuidTool';


const validation = ({ name='', email='', phone='', address='' }) => {

	const err = {};
	if (name.trim().length == 0) err.name = 'Name cannot be blank';
	if (!validator.isEmail(email)) err.email = 'Email is not valid';
	if (!validator.isMobilePhone(phone, 'any')) err.phone = 'Phone is not valid';
	console.log('errs ', err);
	return err;
};



@connect()
@simpleForm({
	fields: ['name', 'email', 'phone', 'company', 'address', 'website', 'instagram', 'facebook'],
	validate: validation
})
class ContactItemForm extends Component {
	constructor(props) {
		super(props);
		this.submit = this.submit.bind(this);
		this.onFileSelect = this.onFileSelect.bind(this);
		this.state = {cardImage: null, cardImageName: null};
		
	}
	submit() {
		const { fields, isFormValid, onOk, preSubmit } = this.props;
		const { cardImage, cardImageName } = this.state;
		preSubmit();
		if (!isFormValid) {
			message.error('Information is not valid');
			return;
		}
		console.log('data ', {...fields, cardImage})
		onOk({ ...fields, cardImage, cardImageName });
	}
	onFileSelect(file) {
		console.log('on file select', file);
		this.setState({ cardImage: file, cardImageName: createUUID()} );
		// getBusinessCardRef().child('abc.jpg').put(file).then(d => console.log('file upload', d))
	}
	render() {
		console.log('fields', this.props);

		const { submit, onFileSelect } = this;
		const { initData, fields, name, phone, email, address, company, website, instagram, facebook, hasSubmitted, okText = 'Ok', cancelText = 'Cancel', onOk, onCancel, isFormValid, showDelete, onDelete } = this.props;
		const { cardImage } = this.state;

		return (
			<div>
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
				<LabelFieldSet label="Website" err={(hasSubmitted||website.touched)&&website.error}>
					<input className="form-control" {...website}/>
				</LabelFieldSet>
				<LabelFieldSet label="Instagram" err={(hasSubmitted||instagram.touched)&&instagram.error}>
					<input className="form-control" {...instagram}/>
				</LabelFieldSet>
				<LabelFieldSet label="Facebook" err={(hasSubmitted||facebook.touched)&&facebook.error}>
					<input className="form-control" {...facebook}/>
				</LabelFieldSet>	
				{
					!cardImage && initData&&initData.downloadURL &&
					<img style={{ width: '100%' }} src={initData.downloadURL}/>
				}
				<ImageUploader onFileSelect={onFileSelect}/>
				<Button type="primary" disabled={hasSubmitted&&!isFormValid} onClick={submit}>{okText}</Button>
				<Button style={{marginLeft:20}} type="default" onClick={onCancel}>{cancelText}</Button>
				{
					showDelete &&
					<Popconfirm title="Are you sure to delete this contact?" onConfirm={onDelete} onCancel={() => { }} okText="Yes" cancelText="No">
						<Button style={{float: 'right'}} type="danger" ghost >Delete</Button>
				  </Popconfirm>
				}

			</div>
		)

	}
}
export default ContactItemForm;
