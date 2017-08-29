import React, {
	Component
} from 'react';
import {
	Upload,
	Icon,
	message
} from 'antd';

function getBase64(img, callback) {
	const reader = new FileReader();
	reader.addEventListener('load', () => callback(reader.result));
	reader.readAsDataURL(img);
}

function beforeUpload(file) {
	const isJPG = file.type === 'image/jpeg';
	if (!isJPG) {
		message.error('You can only upload JPG file!');
	}
	const isLt2M = file.size / 1024 / 1024 < 2;
	if (!isLt2M) {
		message.error('Image must smaller than 2MB!');
	}
	return false;
	//   return isJPG && isLt2M;
}

class ImageUploader extends Component {
	constructor(props) {
		super(props);
		this.onFileChange = this.onFileChange.bind(this);
		this.state = {
			imageUrl: null
		};

	}

	handleChange = (info) => {
		if (info.file.status === 'done') {
			// Get this url from response in real world.
			getBase64(info.file.originFileObj, imageUrl => this.setState({
				imageUrl
			}));
		}
	}

	onFileChange(e) {
		const { onFileSelect } = this.props;
		e.preventDefault();
		const file = e.target.files[0];
		getBase64(e.target.files[0], imageUrl => this.setState({
				file,
				imageUrl
		}));

		onFileSelect&&onFileSelect(file);
	}

	render() {
		const {
			imageUrl
		} = this.state;
		const {
			onFileChange
		} = this;

		return (

			<div>
				<input type="file" onChange={onFileChange} />
				{
					imageUrl ?
						<img src={imageUrl} alt="" className="avatar" /> :
						<Icon type="plus" className="avatar-uploader-trigger" />
					}
				<button onClick={() => this.setState({file: null, imageUrl: null})}>Remove</button>
			</div>
    );
	}
}

export default ImageUploader;

//   <Upload
//     className="ImageUploader-uploader"
//     name="avatar"
//     showUploadList={false}
//     action="//jsonplaceholder.typicode.com/posts/"
//     beforeUpload={beforeUpload}
//     onChange={this.handleChange}
//   >
//     {
//       imageUrl ?
//         <img src={imageUrl} alt="" className="avatar" /> :
//         <Icon type="plus" className="avatar-uploader-trigger" />
//     }
//   </Upload>
