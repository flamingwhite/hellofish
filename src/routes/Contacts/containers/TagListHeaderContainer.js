import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Tag, Modal, Tabs, message, Card, Icon, Popconfirm} from 'antd';
import TagListHeader from '../components/TagListHeader';
import {toggleArrayItem} from '../../../lib/littleFn';
import {updateContactTagById} from '../../../fireQuery/tagsQuery';

@connect(
	state => ({
		tags: state.tagChunk.tags
	})
)
class TagListHeaderContainer extends Component {

	state = {
		edittingTags: false
	}

	archiveTag = _id => {
		updateContactTagById(_id, { archived: true })
			.then(() => message.success('Tag archived'))
	}

	unarchivedTag = _id => {
		updateContactTagById(_id, { archived: false })
			.then(() => message.success('Tag restored'));

	}

	onTagClick = tag => {
		const { onActiveTagsChange, activeTagKeys } = this.props;
		onActiveTagsChange(toggleArrayItem(activeTagKeys, tag.key))
	}

	render() {

		const { onActiveTagsChange, tags, ...rest } = this.props;
		const { edittingTags } = this.state;

		const renderActive = tag => (
			<div className="row">
				<div className="col-10"> {tag.label} </div>
				<Popconfirm title="Are you sure archive this Tag?" onConfirm={() =>this.archiveTag(tag._id)} onCancel={() => { }} okText="Yes" cancelText="No">
					<a href="#">Archive</a>
				</Popconfirm>
			</div>
		);

		const renderArchived = tag => (
			<div className="row">
				<div className="col-6"> {tag.label} </div>
				<a className="col-2" href="#" onClick={() => this.unarchivedTag(tag._id)}>Restore</a>
				<Popconfirm title="Are you sure permanently this Tag? This action is not reversable" onConfirm={() => { }} onCancel={() => { }} okText="Yes" cancelText="No">
					<a className="col-4" href="#">permanently Delete</a>
				</Popconfirm>
			</div>
		);

		return (
			<div>
				<TagListHeader {...rest} tags={tags.filter(tg=>!tg.archived)} onTagClick={this.onTagClick} />
				<Tag onClick={() => this.setState({edittingTags: true})}>Manage Tags</Tag>
				{
					edittingTags &&
					<Modal
						title={"Edit Tags"}
						visible={edittingTags}
						onCancel={() => this.setState({edittingTags: false})}
						footer={null}
					>
						<Tabs>
							<Tabs.TabPane tab="Active Tags" key="1">
								{
									tags.filter(tg => !tg.archived)
										.map(renderActive)
								}
							</Tabs.TabPane>	
							<Tabs.TabPane tab="Archived Tags" key="2">
								{
									tags.filter(tg => tg.archived)
										.map(renderArchived)
								}
							</Tabs.TabPane>	
						</Tabs>	

					</Modal>	

				}
			</div>
		);
	}
}


export default TagListHeaderContainer;

