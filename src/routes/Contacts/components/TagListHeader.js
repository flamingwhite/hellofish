import React,{Component} from 'react';
import { Tag } from 'antd';
import {toggleArrayItem} from '../../../lib/littleFn';


const TagListHeader = props => {

	const { tags, activeTagKeys, color, onClose, onTagClick, ...rest} = props;


	const tagColor = tag => activeTagKeys.includes(tag.key) ? '#f50' : 'blue';

	const renderTag = tag => <Tag onClick={() => onTagClick(tag)} color={tagColor(tag)} key={tag.key} style={{marginBottom: 7}}>{tag.label}</Tag>

	return (
		<span {...rest}>
			{
				tags.map(renderTag)
			}
		</span>	
	);

}

export default TagListHeader;