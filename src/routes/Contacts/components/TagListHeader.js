import React,{Component} from 'react';
import { Tag } from 'antd';
import {toggleArrayItem} from '../../../lib/littleFn';


const TagListHeader = props => {

	const { tags, activeTagKeys, color, onClose, onActiveTagsChange, ...rest} = props;


	const tagColor = tag => activeTagKeys.includes(tag.key) ? '#f50' : 'blue';

	const renderTag = tag => <Tag onClick={()=>onActiveTagsChange(toggleArrayItem(activeTagKeys, tag.key))} color={tagColor(tag)} key={tag.key} >{tag.label}</Tag>
	// const renderTag = tag => <span className="tag-span" key={tag.key}>@{tag.label}</span>

	return (
		<span {...rest}>
			{
				tags.map(renderTag)
			}
		</span>	
	);

}

export default TagListHeader;