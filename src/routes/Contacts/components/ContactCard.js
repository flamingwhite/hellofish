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
	},
	{
		key: 'website',
		label: 'Website'
	},
	{
		key: 'instagram',
		label: 'Instagram'
	}, {
		key: 'facebook',
		label: 'Facebook'
	}
];

const ContactCard = props => {
	const { info, search, onEditClick } = props;
	// const { name, age, email, phone, search} = props;
	const { name, ...rest } = info;
	const nameTitle = <p><SearchHighlight search={search} value={name} /></p>;

	console.log('search in cars', search);

	const renderRow = (label, value) => (
		<div key={label}>
			<p style={{ fontWeight: 'bold', fontSize: 12, color:'darkGray' }}>{label}</p>
			<SearchHighlight search={search} value={value}/>
		</div>	
	)
	return (
		<Card title={nameTitle} extra={<a onClick={() => onEditClick(info)}>Edit</a>}  className="contact-card">
			<Row >
				<Col  className="card-text">
					{
						columns.filter(c => !c.notShow && info[c.key]!=null && info[c.key]!='').map(c => renderRow(c.label, info[c.key]))
					}
				</Col>
			</Row>


	  </Card>
	);
};

export default ContactCard;



