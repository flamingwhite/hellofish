import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Tag, Modal, Tabs, message, Card, Icon, Popconfirm, Input} from 'antd';
import TagListHeader from '../components/TagListHeader';
import {toggleArrayItem} from '../../../lib/littleFn';
import {updateContactTagById, deleteContactTagById} from '../../../fireQuery/tagsQuery';

@connect(
	state => ({
		tags: state.tagChunk.tags
	})
)
class TagListHeaderContainer extends Component {

	state = {
		edittingTags: false
	}

	archiveTag = tag => {
		updateContactTagById(tag._id, { archived: true })
			.then(() => message.success(`Tag ${tag.label} archived`))
	}

	unarchivedTag = tag => {
		updateContactTagById(tag._id, { archived: false })
			.then(() => message.success(`Tag ${tag.label} restored`));

	}

	onTagClick = tag => {
		const { onActiveTagsChange, activeTagKeys } = this.props;
		onActiveTagsChange(toggleArrayItem(activeTagKeys, tag.key))
	}

	startEdittingLabel = tag => this.setState({
		tagInEdit: tag,
		tempLabel: tag.label
	});

	handleKeyPress = e => {
		if (e.key != 'Enter') return;
		const { tagInEdit, tempLabel } = this.state;
		if (this.editErrorMsg(tagInEdit.label, tempLabel) != null) return;

		updateContactTagById(tagInEdit._id, { label: tempLabel })
			.then(r => {
				console.log(r);
				message.success(`Tag ${tagInEdit.label} changed to ${tempLabel}`)
				this.setState({
					tagInEdit: null,
					tempLabel: ''
				});
			})

	}

	permanentlyDeleteTag = tag => {
		const { afterTagDelete } = this.props;
		return deleteContactTagById(tag._id)
			.then(() => afterTagDelete(tag))


	}

	editErrorMsg = (oldLabel = '', newLabel = '') => { 
		const { tags } = this.props;
		return !newLabel.trim() ? 'Cannot be blank' :
		oldLabel.trim() == newLabel.trim() ? '' :
		tags.find(tg => (tg.label || '').trim() == newLabel.trim()) ? 'Duplicated tag name' : null		
	}


	render() {

		const { onActiveTagsChange, tags, ...rest } = this.props;
		const { edittingTags, tagInEdit, tempLabel } = this.state;
		const { startEdittingLabel, handleKeyPress, editErrorMsg } = this;

		const renderActive = tag => (
			<div className="row" style={{ padding: 3 }}>
				<div className="col-10">
					{
						tagInEdit != tag?
						<a onClick={()=>startEdittingLabel(tag)}>{tag.label}</a>
						: [
							<Input
								value={tempLabel}
								onKeyPress={handleKeyPress}
								onChange={e => this.setState({ tempLabel: e.target.value })}
								style={{ width: 120 }}
								suffix={editErrorMsg(tag.label, tempLabel) ==null && <Icon type="check" style={{color:'green'}} />}
								/>,
							<a style={{marginLeft:8}} onClick={()=>this.setState({tagInEdit: null})}>Cancel</a>,
							<span className="tag-error danger text-danger">{ editErrorMsg(tag.label, tempLabel) }</span>
						]
					}
					
				</div>
				<Popconfirm title={`Are you sure archive ${tag.label}?`} onConfirm={() =>this.archiveTag(tag)} onCancel={() => { }} okText="Yes" cancelText="No">
					<a href="#">Archive</a>
				</Popconfirm>
			</div>
		);

		const renderArchived = tag => (
			<div className="row" style={{ padding: 3 }}>
				<div className="col-6"> {tag.label} </div>
				<a className="col-2" href="#" onClick={() => this.unarchivedTag(tag)}>Restore</a>
				<Popconfirm title={`Are you sure permanently ${tag.label}? \nThe app will also delete this tag from Contacts. \nThis action is not reversable`} onConfirm={()=>this.permanentlyDeleteTag(tag)} onCancel={() => { }} okText="Yes" cancelText="No">
					<a className="col-4 text-danger" >permanently Delete</a>
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

