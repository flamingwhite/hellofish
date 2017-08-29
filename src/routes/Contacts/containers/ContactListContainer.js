import {
	connect
} from 'react-redux';
import ContactList from '../components/ContactList';
import React, {Component} from 'react';
import {Input, Modal} from 'antd';
import { propContains } from '../../../lib/littleFn';
import ContactItemForm from './ContactItemForm';
import {createContact, updateContact} from '../../../store/contactsQuery';

@connect(
	state => ({
		contacts: state.contactChunk.contacts
	})
)
class ContactListContainer extends Component {
	constructor(props) {
		super(props);
		// props.dispatch(actions.fetchContacts());
		console.log('does it happen');
		this.state = {
			searchKey: '',
			visible: false,
			contactInEdit: null,
			inNewMode: false
		};
		this.onSearchChange = this.onSearchChange.bind(this);
		this.updateContact = this.updateContact.bind(this);
		this.openContactDialog = this.openContactDialog.bind(this);
		this.onModalCancel = this.onModalCancel.bind(this);
		this.newContactClick = this.newContactClick.bind(this);
		this.createContact = this.createContact.bind(this);
		
		
		
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
			inNewMode: false
		})
	}

	openContactDialog(ct) {
		this.setState({
			contactInEdit: ct,
			inNewMode: false
		});
	}

	onModalCancel() {
		this.setState({
			contactInEdit: null,
			inNewMode: false
		});
	}

	newContactClick() {
		this.setState({
			contactInEdit: null,
			inNewMode: true
		})
	}

	createContact(contact) {
		console.log(contact);
		var x = createContact(contact);
		this.setState({
			inNewMode: false
		});

	}

	render() {
		const { onSearchChange, onModalCancel, updateContact, openContactDialog, newContactClick, createContact } = this;
		const { contacts } = this.props;
		const { searchKey, contactInEdit, inNewMode } = this.state;


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
				<button onClick={newContactClick}>Add New</button>
				<ContactList search={searchKey} contacts={contacts.filter(propContains(searchKey, ['name', 'email', 'phone', 'address','comments']) )} onEditClick={openContactDialog} />

				{
					contactInEdit &&
					<Modal title={"Edit " + contactInEdit.name}
						visible={contactInEdit}
						onOk={updateContact}
						onCancel={onModalCancel}
						okText={"Update"}
						cancelText={"Cancel"}
					>
						<ContactItemForm okText="Update" initData={contactInEdit} />
					</Modal>	
				}
				{
					inNewMode &&
					<Modal title={"Create New Contact "}
						visible={inNewMode}
						onOk={createContact}
						onCancel={onModalCancel}
						okText={"Create"}
						cancelText={"Cancel"}
						footer={null}
					>
						<ContactItemForm onOk={createContact} onCancel={onModalCancel} okText="Create" />
					</Modal>	
				}
			</div>
		)

	}
}

export default ContactListContainer;