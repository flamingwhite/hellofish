import {
	connect
} from 'react-redux';
import ContactList from '../components/ContactList';
import React, {Component} from 'react';
import {Input, Modal, Button, message} from 'antd';
import { propContains } from '../../../lib/littleFn';
import {getBusinessCardRef} from '../../../store/fireConnection';
import ContactItemForm from './ContactItemForm';
import {createContact, updateContactById, deleteContactById} from '../../../store/contactsQuery';
import '../../../styles/bricklayer.scss';

@connect(
	state => ({
		contacts: state.contactChunk.contacts
	})
)
class ContactListContainer extends Component {
	constructor(props) {
		super(props);
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
		this.deleteContact = this.deleteContact.bind(this);

	}

	onSearchChange(evt) {
		this.setState({
			searchKey: evt.target.value
		});
	}

	async updateContact(contact) {
		const orig = this.state.contactInEdit;

		console.log('to update j', contact, orig);

		let downloadURL = null;
		if (contact.cardImage && contact.cardImageName && (orig.cardImage!=contact.cardImage)) {
			const snap = await getBusinessCardRef().child(contact.cardImageName).put(contact.cardImage);
			downloadURL = snap.downloadURL;
		}
		if (orig.downloadURL && !contact.downloadURL) {
			// await getBusinessCardRef().child(orig.cardImage).delete().then(console.log);
			console.log('==============','get into deleteimage');
			contact.cardImageName = null;
			contact.downloadURL = null;
			
		}

		if (downloadURL) {
			contact = { ...contact, downloadURL };
		}

		console.log('-----------------downloadURL,j', downloadURL);
		console.log(contact, 'updated');
		console.log(this.state.contactInEdit)
		await updateContactById(orig._id, contact);
		message.success('Contact Updated')

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


	async createContact(contact) {
		let downloadURL = null;
		if (contact.cardImage && contact.cardImageName) {
			const snap = await getBusinessCardRef().child(contact.cardImageName).put(contact.cardImage);
			downloadURL = snap.downloadURL;
		}

		if (downloadURL) {
			contact = { ...contact, downloadURL };
		}

		console.log(contact);
		await createContact(contact);
		message.success('Contact Created');
		
		this.setState({
			inNewMode: false
		});

	}
	
	deleteContact() {
		const { _id, name } = this.state.contactInEdit;
		deleteContactById(_id)
			.then(() => {
				message.success('Contact ' + name + ' removed');
				this.setState({
					contactInEdit: null
				});
			})
			.catch(err => {
				console.error(err);
				message.error('Error!');
			})

	}

	render() {
		const { onSearchChange, onModalCancel, updateContact, openContactDialog, newContactClick, createContact, deleteContact } = this;
		const { contacts } = this.props;
		const { searchKey, contactInEdit, inNewMode } = this.state;


		console.log('searchkey is ', searchKey);
		return (
			<div className="row">
				<Input
					placeholder="input search text"
					className="col-6 col-xs-8"
					onSearch={value => console.log(value)}
					onChange={onSearchChange}
				/>
				<Button className="" style={{marginLeft:20}} type="primary" icon="plus" onClick={newContactClick}>New</Button>
				<ContactList search={searchKey} contacts={contacts.filter(propContains(searchKey, ['name', 'email', 'phone', 'address','comments']) )} onEditClick={openContactDialog} />

				{
					contactInEdit &&
					<Modal title={"Edit " + contactInEdit.name}
						visible={contactInEdit != null}
						footer={null}
						onCancel={onModalCancel}
					>
						<ContactItemForm onOk={updateContact} onCancel={onModalCancel} okText="Update" showDelete={true} onDelete={deleteContact} initData={contactInEdit}  />
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