import React from 'react';
import R from 'ramda';

const SearchHighlight = props => {
	const { search, value = '', bg = 'yellow',  ...rest } = props;

	const str = value.split(search)//.join(`<span style=${{ backgroundColor: bg }}>${search}</span>`);

	return (
		<span {...rest}>
			{R.init(str).map(v => <span>{v}<span style={{ backgroundColor: bg }}>{search}</span></span>)}
			{R.last(str)}
		</span>
	)

}

export default SearchHighlight;