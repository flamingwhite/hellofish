import React from 'react';
import ContactCard from './ContactCard';
import {Row, Col} from 'antd';
import Masonry from 'react-masonry-component';

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

export default class ContactList extends React.Component {
	render() {
		const { contacts, ...rest} = this.props;
		return (

			<Masonry style={{width: '100%'}} gutter={15} ref={c => this.list = c}>
				{
					contacts.map(ct => <Col key={ct.id} xs={24} sm={12} md={6} xl={4}> <ContactCard {...rest} info={ct} key={ct.id} /> </Col>)
				}

		</Masonry>
		)

	}
}

	// render() {
	// 	const { contacts, ...rest} = this.props;
	// 	return (
	// 		<Row className="bricklayer" gutter={15} ref={c => this.list = c}>
	// 			{
	// 				contacts.map(ct => <Col key={ct.id} xs={24} sm={12} md={6}> <ContactCard {...rest} info={ct} key={ct.id} /> </Col>)
	// 			}
	// 		</Row>	
	// 	)

	// }
// const ContactList = props => {
// 	const { contacts, ...rest} = props;
// 	return (
// 		<Row class="bricklayer" gutter={15} ref="contactList">
// 			{
// 				contacts.map(ct => <Col key={ct.id} xs={24} sm={12} md={6}> <ContactCard {...rest} info={ct} key={ct.id} /> </Col>)
// 			}
// 		</Row>	
// 	)
// }

// export default ContactList;