import React, {Component} from 'react';
import {connect} from 'react-redux';
import {message, Spin} from 'antd';
import TagInput from '../components/TagInput';
import {createContactTag, updateContactTagById} from '../../../fireQuery/tagsQuery';

@connect(
	state => ({
		tags: state.tagChunk.tags
	})
)
export default class TagInputContainer extends Component {
	state = {
		loading: false
	 };

	addNewTag = label => {
		const { onTagChange, activeTagKeys } = this.props;
		if (!label) return;

		const cleanLabel = label.split(' ').reduce((acc, cur) => acc + cur.slice(0, 1).toUpperCase() + cur.slice(1));

		const tag = {
			key: cleanLabel,
			label: cleanLabel
		}

		this.setState({
			loading: true
		});
		return createContactTag(tag)
			.then(r => {
				console.log(r);
				message.success(label+ ' created');
				onTagChange([...activeTagKeys, tag.key])
				this.setState({loading: false})

			}).catch(e => {
				console.log(e);
				this.setState({loading: false})
			})

	}

	onTagSelect = tag => {
		const { onTagChange, activeTagKeys } = this.props;
		onTagChange([...activeTagKeys, tag.key]);
	}

	onClose = tag => {
		const { onTagChange, activeTagKeys } = this.props;
		onTagChange(activeTagKeys.filter(k => k != tag.key));
	}


	render() {

		const { tags, ...rest } = this.props;
		const { addNewTag, onTagSelect, onClose } = this;
		const { loading } = this.state;
		
		return (
			<Spin spinning={loading} style={{borderBottom: '1px solid lightgray'}}>
				<TagInput {...rest} tags={tags} addNewTag={addNewTag} onTagSelect={onTagSelect} onClose={onClose} />
			</Spin>

		);
	}

}