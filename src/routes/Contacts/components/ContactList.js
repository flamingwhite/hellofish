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
	constructor(props) {
		super(props);
		this.state = {
			hoverCard: null
		}
	}
	render() {
		const { contacts, ...rest} = this.props;
		const { hoverCard } = this.state;
		return (

			<Masonry style={{width: '100%'}} >
				{
					contacts.map(ct => <Col key={ct._id} xs={24} sm={12} md={8} lg={6} xl={4}> <ContactCard  {...rest} info={ct}/> </Col>)
				}

		</Masonry>
		)

	}
}
