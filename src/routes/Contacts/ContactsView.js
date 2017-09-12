import React, { Component } from 'react';
import ContactListContainer from './containers/ContactListContainer';
import {BackTop} from 'antd';

class ContactsView extends Component {

	render() {
		return (
			<div style={{ padding: 10 }}>
				<BackTop />
				<ContactListContainer/>
			</div>
		);
	}
}

export default ContactsView;
