import React,{Component} from 'react';
import {Tag} from 'antd';


const TagList = props => {

	const { tags, activeTagKeys, color, onClose, ...rest} = props;
	const renderTag = tag => <span className="tag-span" key={tag.key}>@{tag.label}</span>

	return (
		<span {...rest}>
			{
				tags.map(renderTag)
			}
		</span>	
	);

}

export default TagList;