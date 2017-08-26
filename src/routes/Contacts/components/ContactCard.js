import React from 'react';
import {Card} from 'antd';
import SearchHighlight from '../../../commonCmps/SearchHighlight';
import {Col, Row} from 'antd';

const columns = [
	{
		key: 'name',
		label: 'Name',
		notShow: true
	},
	{
		key: 'email',
		label: 'Email',
	},
	{
		key: 'phone',
		label: 'Phone',
	},
	{
		key: 'address',
		label: 'Address',
	},
	{
		key: 'company',
		label: 'Company',
	}
];

const ContactCard = props => {
	const { info, search } = props;
	// const { name, age, email, phone, search} = props;
	const { name, ...rest } = info;
	const nameTitle = <p><SearchHighlight search={search} value={name} /></p>;

	const renderRow = (label, value) => (
		<p>
			<p style={{ fontWeight: 'bold', fontSize: 12, color:'darkGray' }}>{label}</p>
			<SearchHighlight search={search} value={value}/>
		</p>	
	)
	return (
		<Card title={nameTitle} extra={<a href="#">More</a>}  className="contact-card">
			<Row >
				<Col  className="card-text">
					{
						columns.filter(c => !c.notShow && info[c.key]!=null).map(c => renderRow(c.label, info[c.key]))
					}
				</Col>
			</Row>


	  </Card>
	);
};

export default ContactCard;



