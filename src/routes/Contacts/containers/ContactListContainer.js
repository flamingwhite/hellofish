import {
	connect
} from 'react-redux';
import ContactList from '../components/ContactList';
import React, {Component} from 'react';
import {actions} from '../contactsReducer';
import {Input} from 'antd';
import { propContains } from '../../../lib/littleFn';

class ContactListContainer extends Component {
	constructor(props) {
		super(props);
		props.dispatch(actions.fetchContacts());
		console.log('does it happen');
		this.state = {
			searchKey : ''
		};
		this.onSearchChange = this.onSearchChange.bind(this);
		
	}

	onSearchChange(evt) {
		this.setState({
			searchKey: evt.target.value
		});
	}

	render() {
		const { onSearchChange } = this;
		const { contacts } = this.props;
		const { searchKey } = this.state;
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
				<ContactList search={searchKey} contacts={contacts.filter(propContains(searchKey, ['name', 'email', 'phone', 'address','comments']) )}/>
			</div>
		)

	}
}

export default connect(
	state => ({
		contacts: state.contactChunk.contacts
	})
)(ContactListContainer);
