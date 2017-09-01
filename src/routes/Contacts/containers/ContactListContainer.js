import {
	connect
} from 'react-redux';
import ContactList from '../components/ContactList';
import React, {Component} from 'react';
import {Input, Modal, Button, message, Icon, Spin} from 'antd';
import { propContains } from '../../../lib/littleFn';
import {getBusinessCardRef} from '../../../store/fireConnection';
import ContactItemForm from './ContactItemForm';
import {createContact, updateContactById, deleteContactById} from '../../../store/contactsQuery';
import cardColors from '../../../properties/cardColors';
import '../../../styles/bricklayer.scss';
import ColorList from '../components/ColorList';
import {getFirebase} from '../../../store/fireConnection';
import R from 'ramda';

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
			inNewMode: false,
			showEmailTextArea: false,
			modalLoading: false,
			activeColorIds: []
		};
		this.onSearchChange = this.onSearchChange.bind(this);
		this.updateContact = this.updateContact.bind(this);
		this.openContactDialog = this.openContactDialog.bind(this);
		this.onModalCancel = this.onModalCancel.bind(this);
		this.newContactClick = this.newContactClick.bind(this);
		this.createContact = this.createContact.bind(this);
		this.deleteContact = this.deleteContact.bind(this);
		this.toggleColor = this.toggleColor.bind(this);
		

	}

	onSearchChange(evt) {
		this.setState({
			searchKey: evt.target.value
		});
	}

	async updateContact(contact) {
		this.setState({ modalLoading: true });
		const orig = this.state.contactInEdit;

		console.log('to update j', contact, orig);

		console.log(this.state.contactInEdit)
		await updateContactById(orig._id, contact);
		message.success('Contact Updated')

		this.setState({
			contactInEdit: null,
			inNewMode: false,
			modalLoading: false
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
		this.setState({modalLoading: true});
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
			inNewMode: false,
			modalLoading: false
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

	toggleColor(color) {
		const colorId = color.id;
		const { activeColorIds } = this.state;
		if (!activeColorIds.includes(colorId)) {
			this.setState({
				activeColorIds: [...activeColorIds, colorId]
			})
		} else {
			this.setState({
				activeColorIds: activeColorIds.filter(c => c != colorId)
			});
		}
	}

	render() {
		const { onSearchChange, onModalCancel, updateContact, openContactDialog, newContactClick, createContact, deleteContact, toggleColor } = this;
		const { contacts } = this.props;
		const { searchKey, contactInEdit, inNewMode, showEmailTextArea, activeColorIds, modalLoading } = this.state;

		const visibleContacts = contacts.filter(propContains(searchKey, ['name', 'email', 'phone', 'address', 'comments', 'facebook', 'instagram', 'website']))
			.filter(c => R.isEmpty(activeColorIds) || activeColorIds.includes(c.color || 'white'));
		
		const visibleContactsEmails = visibleContacts.filter(c => c.email).map(c => c.email).join('; ');


		console.log('searchkey is ', searchKey);
		return (
			<div className="row">
				
				<Input
					placeholder="input search text"
					className="col-6 col-xs-8"
					onChange={onSearchChange}
				/>
				<Button className="" style={{marginLeft:20}} type="primary" icon="plus" onClick={newContactClick}>New</Button>
				<p/>

				<div>
					<ColorList colors={cardColors} onColorSelect={toggleColor} activeColorIds={activeColorIds} />
					{
						!R.isEmpty(activeColorIds) &&
						<Icon class="clear-icon" size="large" type="close" onClick={()=>this.setState({activeColorIds:[]})}/>
					}
				</div>	
				{
					!showEmailTextArea &&
					<Icon onClick={()=>this.setState({showEmailTextArea:true})} type="mail" className="email-icon"/>
				}
				{
					showEmailTextArea &&
					<Icon onClick={()=>this.setState({showEmailTextArea:false})} type="close-circle-o" className="email-icon"/>
				}

				{
					showEmailTextArea &&
					<div className="email-textarea-div">
						<Input.TextArea  value={visibleContactsEmails} />
					</div>
				}
				

				<ContactList search={searchKey} contacts={visibleContacts} onEditClick={openContactDialog} />

				{
					contactInEdit &&
					<Modal title={"Edit " + contactInEdit.name}
						visible={contactInEdit != null}
						footer={null}
						onCancel={onModalCancel}
					>
						<ContactItemForm loading={modalLoading} loadingText={"Updating"} onOk={updateContact} onCancel={onModalCancel} okText="Update" showDelete={true} onDelete={deleteContact} initData={contactInEdit}  />
					</Modal>	
				}
				{
					inNewMode &&

					<Modal title={"Create New Contact "}
						visible={inNewMode}
						footer={null}
						onCancel={onModalCancel}
					>
						<ContactItemForm loading={modalLoading} loadingText={"Creating"} onOk={createContact} onCancel={onModalCancel} okText="Create" />
					</Modal>	
				}
			</div>
		)

	}
}

export default ContactListContainer;