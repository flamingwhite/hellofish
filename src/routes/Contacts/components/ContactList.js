import React from 'react';
import ContactCard from './ContactCard';
import {Row, Col} from 'antd';

const style = {
	card: {
		float: 'left',
		padding: 10

	}
}

const columns = [{
	title: 'Name',
	dataIndex: 'name',
	key: 'name'
	
}, {
	title: 'Age',
	dataIndex: 'age',
	key: 'age',
}, {
	title: 'Email',
	dataIndex: 'email',
	key: 'email',
}, {
	title: 'phone',
	dataIndex: 'phone',
	key: 'phone'
}];

const ContactList = props => {
	const { contacts, search } = props;
	return (
		<Row gutter={15}>
			{
				contacts.map(ct => <Col xs={24} sm={12} md={6}> <ContactCard search={search} info={ct} key={ct.id} /> </Col>)
			}
		</Row>	
	)
}

export default ContactList;