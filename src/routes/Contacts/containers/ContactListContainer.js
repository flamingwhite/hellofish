import {
	connect
} from 'react-redux';
import ContactList from '../components/ContactList';
import React, {Component} from 'react';
import {Tag,Input, Modal, Button, message, Icon, Tooltip} from 'antd';
import { propContains, toggleArrayItem } from '../../../lib/littleFn';
import {getBusinessCardRef} from '../../../fireQuery/fireConnection';
import ContactItemForm from './ContactItemForm';
import {createContact, updateContactById, deleteContactById, getContactsRef} from '../../../fireQuery/contactsQuery';
import cardColors from '../../../properties/cardColors';
import '../../../styles/bricklayer.scss';
import ColorList from '../components/ColorList';
import TagInputContainer from '../containers/TagInputContainer';
import TagList from '../components/TagList';
import TagListHeaderContainer from '../containers/TagListHeaderContainer';
import R from 'ramda';

@connect(
	state => ({
		contacts: state.contactChunk.contacts,
		touchOnly: state.env.touchOnly,
		tags: state.tagChunk.tags
	})
)
class ContactListContainer extends Component {
	constructor(props) {
		super(props);
		this.state = {
			searchKey: '',
			visible: false,
			contactInEdit: null,
			showTrafficModal: false,
			inNewMode: false,
			showEmailTextArea: false,
			showPhoneTextArea: false,
			showOnlyDeleted: false,
			modalLoading: false,
			activeColorIds: [],
			activeTagKeys: []
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
		const { activeColorIds } = this.state;
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
		
		if (activeColorIds.length == 1) { 
			contact.color = activeColorIds[0];
		}

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

	deleteTagFromContacts = tag => {

		console.log(tag, 'is deleted by user');

		// const { contacts } = this.props;
		// const { key } = tag;
		// const updates = {};
		// contacts.filter(ct => ct.tagKeySet[key])
		// 	.forEach(ct => updates[`${ct._id}/tagKeySet/${tag.key}`] = null);
		// getContactsRef().update(updates);
	}


	toggleColor = color => {
		const colorId = color.id;
		const { activeColorIds } = this.state;
		this.setState({
			activeColorIds: toggleArrayItem(activeColorIds, colorId)
		});
	}

	render() {
		const { onSearchChange, onModalCancel, updateContact, openContactDialog, newContactClick, createContact, deleteContact, toggleColor, revertContact, completelyDeleteContact, deleteTagFromContacts} = this;
		const { contacts, touchOnly, tags } = this.props;
		const { searchKey, contactInEdit, inNewMode, showEmailTextArea, activeColorIds, modalLoading, showOnlyDeleted, showPhoneTextArea, activeTagKeys, showTrafficModal } = this.state;

		// const visibleContacts = contacts.filter(c => (showOnlyDeleted&&c.deleted)||(!showOnlyDeleted&&!c.deleted) ).filter(propContains(searchKey, ['name', 'email', 'phone', 'address', 'comments', 'facebook', 'instagram', 'website']))
		// 	.filter(c => R.isEmpty(activeColorIds) || activeColorIds.includes(c.color || 'white'));

		const visibleContacts = contacts.filter(c => (!showOnlyDeleted == !c.deleted)
			&& propContains(searchKey, ['name', 'email', 'phone', 'address', 'comments', 'facebook', 'instagram', 'website'])(c)
			&& (R.isEmpty(activeColorIds) || activeColorIds.includes(c.color || 'white'))
			&& (R.isEmpty(activeTagKeys) || R.all(key => (c.tagKeySet || {})[key], activeTagKeys))
		);
		

		return (
			<div className="row">
				<div style={{ width: '100%', marginBottom:10 }}>
					<Tag color="pink">{visibleContacts.length} Contacts</Tag>
					<TagListHeaderContainer afterTagDelete={tag => deleteTagFromContacts(tag)} activeTagKeys={activeTagKeys} onActiveTagsChange={keys=>this.setState({activeTagKeys: keys})} tags={tags}/>
				</div>
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


				<Tooltip title="Trafic to Home">					
					<Icon type="car" className="fn-icon" onClick={()=>this.setState({showTrafficModal: true})}/>
				</Tooltip>

				<Input
					placeholder="Search"
					className="col-4 col-xs-6"
					onChange={onSearchChange}
					style={{marginLeft:10}}
				/>
				<Button style={{marginLeft:20}} type="primary" icon="plus" onClick={newContactClick}>New</Button>
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

				<ContactList tags={tags} touchOnly={touchOnly} search={searchKey} contacts={visibleContacts} onEditClick={openContactDialog} onRevertContact={revertContact} completelyDeleteContact={completelyDeleteContact}/>

				{
					showTrafficModal &&
					<Modal
						title={"Traffic to Home"}	
						visible={showTrafficModal}
						footer={null}
						width="640"
						onCancel={()=>this.setState({showTrafficModal: false})}
					>
						<iframe src="https://www.google.com/maps/embed?pb=!1m28!1m12!1m3!1d105883.51706200307!2d-84.35317492387183!3d33.97044007941706!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m13!3e6!4m5!1s0x88f5a6cd50cafac7%3A0xab7849cc6cc913f3!2sehair+norcross!3m2!1d33.927147!2d-84.217669!4m5!1s0x88f574ea5a5ef381%3A0xc9e2b7a72191d06b!2s2505+Timbercreek+Circle%2C+Roswell%2C+GA!3m2!1d34.047036399999996!2d-84.3299858!5e0!3m2!1sen!2sus!4v1505239889502" width="600" height="450" frameBorder="0" style={{border: 0}} allowFullScreen></iframe>
					</Modal>	

				}

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