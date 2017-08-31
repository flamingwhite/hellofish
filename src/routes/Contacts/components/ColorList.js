import React, {Component} from 'react';

class ColorList extends Component {
	constructor(props) {
		super(props);
		this.state = {
			hoverColorId: null
		}
	}

	



	render() {
		const { colors, activeColorId, onColorSelect } = this.props;
		const { hoverColorId } = this.state;
		const isColorActive = color => color.id == activeColorId || color.id == hoverColorId;

		const renderColor = color => (
			<span style={isColorActive(color) ? { border: '2px solid '+ color.value } : {}} className="color-box-wrapper" onClick={() => onColorSelect(color)} onMouseEnter={() => this.setState({ hoverColorId: color.id })} onMouseLeave={() => this.setState({hoverColorId: null})}>
				<span className="color-box" style={{backgroundColor: color.value, border:'1px solid '+color.borderColor||color.color}}></span>
			</span>
		)

		return (
			<span>
				{colors.map(renderColor)}
			</span>	
		);

	}
}


export default ColorList;



