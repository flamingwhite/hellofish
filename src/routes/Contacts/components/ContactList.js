import React from 'react';
import ContactCard from './ContactCard';
import {Row, Col} from 'antd';
import Masonry from 'react-masonry-component';
import VisibilitySensor from 'react-visibility-sensor';

export default class ContactList extends React.Component {
	state = {
		perPage: 5,
		visibleCount: 5,
		loadedAll: false,
	};

	onVisibleChange = isVisible => {
		this.setState({
			isVisible
		})
		if (isVisible) {
			console.log('can see it, load more');
			this.loadMore();
		} else {
			console.log('cannot see nothing');
		}

	}

	componentDidUpdate(prevProps, prevState) {
		const { isVisible, loadedAll } = this.state;
		setTimeout(() => {
		console.log('loaded all isvisible', loadedAll, isVisible);
		if (!loadedAll && isVisible) {
			console.log('keep loading once more in didUpdate');
			this.loadMore();
		}

		}, 300)
	}

	loadMore = () => {
		const { perPage, visibleCount } = this.state;
		const { contacts } = this.props;
		if (visibleCount == contacts.length) {
			this.setState({
				loadedAll: true
			});
			return;
		}
		let newCount = visibleCount + perPage;
		if (newCount > contacts.length) {
			console.log('loaded all do nothing');
			
			newCount = contacts.length
		}
		this.setState({
			visibleCount: newCount
		});

	}

	componentWillReceiveProps(nextProps) {
		// if (this.props.contacts != nextProps.contacts) {
		// 	console.log('contacts changed !!!!!!!!!!!!!!!, reset count');
		// 	this.setState({ visibleCount: 5 });
		// }

		console.log(this.props.contacts.length, nextProps.contacts.length);
		if (this.props.contacts != nextProps.contacts) {
			console.log('reset state, !!!!!!!!!');
			this.setState({
				loadedAll: false,
				visibleCount: 5
			});
		}
	}

	render() {
		const { contacts, ...rest} = this.props;
		const { visibleCount } = this.state;
		const loadedCts = contacts.slice(0, visibleCount);

		return (

			<div style={{ width: '100%' }}>
					{this.state.visibleCount}
					<Masonry
						style={{ width: '100%' }}
						options={{transitionDuration: 100}}
					>

					{
						loadedCts.map(ct => <Col key={ct._id} xs={24} sm={12} md={8} lg={6} xl={4}> <ContactCard  {...rest} info={ct}/> </Col>)
					}

					<VisibilitySensor xs={24} sm={12} md={8} lg={6} xl={4} style={{backgroundColor:'red', height:15}} onChange={this.onVisibleChange} />

				</Masonry>
			</div>
		)

	}
}
