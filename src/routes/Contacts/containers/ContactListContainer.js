import {
	connect
} from 'react-redux';
import ContactList from '../components/ContactList';
import React, {Component} from 'react';
import {Input, Modal, Button} from 'antd';
import { propContains } from '../../../lib/littleFn';
import ContactItemForm from './ContactItemForm';
import {createContact, updateContactById} from '../../../store/contactsQuery';

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
		console.log(this.state.contactInEdit)
		updateContactById(this.state.contactInEdit._id, ct);

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
				<Button style={{marginLeft:20}} type="primary" icon="plus" onClick={newContactClick}>Create New</Button>
				<ContactList search={searchKey} contacts={contacts.filter(propContains(searchKey, ['name', 'email', 'phone', 'address','comments']) )} onEditClick={openContactDialog} />

				{
					contactInEdit &&
					<Modal title={"Edit " + contactInEdit.name}
						visible={contactInEdit != null}
						footer={null}
						onCancel={onModalCancel}
					>
						<ContactItemForm onOk={updateContact} onCancel={onModalCancel} okText="Update" initData={contactInEdit} />
					</Modal>	
				}
				{
					inNewMode &&
					<Modal title={"Create New Contact "}
						visible={inNewMode}
						footer={null}
						onCancel={onModalCancel}
					>
						<ContactItemForm onOk={createContact} onCancel={onModalCancel} okText="Create" />
					</Modal>	
				}
			</div>
		)

	}
}

export default ContactListContainer;