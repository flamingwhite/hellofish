import {
	connect
} from 'react-redux';
import ContactList from '../components/ContactList';
import React, {Component} from 'react';
import {actions} from '../contactsReducer';
import {Input, Modal} from 'antd';
import { propContains } from '../../../lib/littleFn';
import ContactItemForm from './ContactItemForm';

@connect(
	state => ({
		contacts: state.contactChunk.contacts
	})
)
class ContactListContainer extends Component {
	constructor(props) {
		super(props);
		props.dispatch(actions.fetchContacts());
		console.log('does it happen');
		this.state = {
			searchKey: '',
			visible: false,
			contactInEdit: null
		};
		this.onSearchChange = this.onSearchChange.bind(this);
		this.updateContact = this.updateContact.bind(this);
		this.openContactDialog = this.openContactDialog.bind(this);
		this.onModalCancel = this.onModalCancel.bind(this);
		
		
		
		
	}

	onSearchChange(evt) {
		this.setState({
			searchKey: evt.target.value
		});
	}

	updateContact(ct) {
		console.log(ct, 'updated');

		this.setState({
			contactInEdit: null,
			visible: false
		})
	}

	openContactDialog(ct) {
		this.setState({
			contactInEdit: ct,
			visible: true
		});
	}

	onModalCancel() {
		this.setState({
			contactInEdit: null,
			visible: false
		});
	}


	render() {
		const { onSearchChange, onModalCancel, updateContact, openContactDialog } = this;
		const { contacts } = this.props;
		const { searchKey, visible, contactInEdit } = this.state;


		console.log('searchkey is ', searchKey);
		return (
			<div>
				<Input.Search
					size="large"	
					placeholder="input search text"
					style={{ width: 400 }}
					onSearch={value => console.log(value)}
					onChange={onSearchChange}
				/>
				<ContactList search={searchKey} contacts={contacts.filter(propContains(searchKey, ['name', 'email', 'phone', 'address','comments']) )} onEditClick={openContactDialog} />

				{
					contactInEdit &&
					<Modal title={"Edit " + contactInEdit.name}
						visible={visible}
						onOk={this.updateContact}
						onCancel={this.onModalCancel}
					>
						<ContactItemForm initData={contactInEdit} />
					</Modal>	
				}
			</div>
		)

	}
}

export default ContactListContainer;