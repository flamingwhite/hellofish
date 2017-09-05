import {
	connect
} from 'react-redux';
import ContactList from '../components/ContactList';
import React, {Component} from 'react';
import {Input, Modal, Button, message, Icon, Tooltip} from 'antd';
import { propContains, toggleArrayItem } from '../../../lib/littleFn';
import {getBusinessCardRef} from '../../../store/fireConnection';
import ContactItemForm from './ContactItemForm';
import {createContact, updateContactById, deleteContactById} from '../../../store/contactsQuery';
import cardColors from '../../../properties/cardColors';
import '../../../styles/bricklayer.scss';
import ColorList from '../components/ColorList';
import R from 'ramda';

@connect(
	state => ({
		contacts: state.contactChunk.contacts,
		touchOnly: state.env.touchOnly
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
			showPhoneTextArea: false,
			showOnlyDeleted: false,
			modalLoading: false,
			activeColorIds: []
		};

	}

	onSearchChange = evt => this.setState({
		searchKey: evt.target.value
	});

	updateContact = async contact => {
		this.setState({ modalLoading: true });
		const orig = this.state.contactInEdit;
		await updateContactById(orig._id, contact);
		message.success('Contact Updated')

		this.setState({
			contactInEdit: null,
			inNewMode: false,
			modalLoading: false
		})
	}

	openContactDialog = ct => this.setState({
		contactInEdit: ct,
		inNewMode: false
	})

	onModalCancel = () => this.setState({
		contactInEdit: null,
		inNewMode: false
	})

	newContactClick = () => this.setState({
		contactInEdit: null,
		inNewMode: true
	})

	createContact = async contact => {
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

	completeEdit = (promise, successMsg) => {
		return promise.then(() => {
			message.success(successMsg);
			this.setState({
				contactInEdit: null
			});
		})
		.catch(err => {
			console.error(err);
			message.error(err);
		})
	}

	completelyDeleteContact = _id => this.completeEdit(deleteContactById(_id), `Contact ${name} Deleted Permanently`);
	
	deleteContact = () => {
		const { _id, name } = this.state.contactInEdit;
		this.completeEdit(updateContactById(_id, { deleted: true }), `Contact ${name} Moved to Trash`);
	}

	revertContact = _id => this.completeEdit( updateContactById(_id, {deleted: false}) , `Contact ${name} Restored`);


	toggleColor = color => {
		const colorId = color.id;
		const { activeColorIds } = this.state;
		this.setState({
			activeColorIds: toggleArrayItem(activeColorIds, colorId)
		});
	}

	render() {
		const { onSearchChange, onModalCancel, updateContact, openContactDialog, newContactClick, createContact, deleteContact, toggleColor, revertContact, completelyDeleteContact } = this;
		const { contacts, touchOnly } = this.props;
		const { searchKey, contactInEdit, inNewMode, showEmailTextArea, activeColorIds, modalLoading, showOnlyDeleted, showPhoneTextArea } = this.state;

		// const visibleContacts = contacts.filter(c => (showOnlyDeleted&&c.deleted)||(!showOnlyDeleted&&!c.deleted) ).filter(propContains(searchKey, ['name', 'email', 'phone', 'address', 'comments', 'facebook', 'instagram', 'website']))
		// 	.filter(c => R.isEmpty(activeColorIds) || activeColorIds.includes(c.color || 'white'));

		const visibleContacts = contacts.filter(c => (!showOnlyDeleted == !c.deleted)
			&& propContains(searchKey, ['name', 'email', 'phone', 'address', 'comments', 'facebook', 'instagram', 'website'])(c)
			&& (R.isEmpty(activeColorIds) || activeColorIds.includes(c.color || 'white') )
		);
		

		console.log('searchkey is ', searchKey);
		return (
			<div className="row">
				{
					showEmailTextArea ?
					<Tooltip title="Hide Emails">					
						<Icon onClick={()=>this.setState({showEmailTextArea:false})} type="close-circle-o" className="fn-icon"/>
					</Tooltip>
					: <Tooltip title="Get Emails">
						<Icon onClick={() => this.setState({ showEmailTextArea: true })} type="mail" className="fn-icon" />
					</Tooltip>

				}

				{
					showPhoneTextArea ?
					<Tooltip title="Hide Phones">					
						<Icon onClick={()=>this.setState({showPhoneTextArea:false})} type="close-circle-o" className="fn-icon"/>
					</Tooltip>
					: <Tooltip title="Get Phones">
						<Icon onClick={() => this.setState({ showPhoneTextArea: true })} type="phone" className="fn-icon" />
					</Tooltip>

				}
				
				{
					showOnlyDeleted ?
					<Tooltip title="Show Active Contacts">					
						<Icon type="desktop" className="fn-icon" onClick={()=>this.setState({showOnlyDeleted: false})}/>
					</Tooltip>
					: <Tooltip title="Show Deleted Contacts">
						<Icon type="delete" className="fn-icon" onClick={()=>this.setState({showOnlyDeleted: true})}/>	
					</Tooltip>
				}
				<Input
					placeholder="input search text"
					className="col-4 col-xs-6"
					onChange={onSearchChange}
					style={{marginLeft:10}}
				/>
				<Button className="" style={{marginLeft:20}} type="primary" icon="plus" onClick={newContactClick}>New</Button>
				<p/>

				<div>
					<ColorList touchOnly={touchOnly} colors={cardColors} onColorSelect={toggleColor} activeColorIds={activeColorIds} />
				</div>	
				{
					!R.isEmpty(activeColorIds) &&
					<Icon className="fn-icon" type="close" onClick={()=>this.setState({activeColorIds:[]})}/>
				}
				{
					showEmailTextArea &&
					<textarea style={{ width: '100%' }} value={
						visibleContacts.filter(c=>c.email).map(c=>c.email).join('; ')
					} />
				}
				{
					showPhoneTextArea &&
					<textarea style={{ width: '100%' }} value={
						visibleContacts.filter(c => c.phone).map(c=>c.phone).join('; ')
					} />
				}
				
				<ContactList touchOnly={touchOnly} search={searchKey} contacts={visibleContacts} onEditClick={openContactDialog} onRevertContact={revertContact} completelyDeleteContact={completelyDeleteContact}/>

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