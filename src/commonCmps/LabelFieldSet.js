import React from 'react';

const LabelFieldSet = props => { 
		let {label, noMargin, className, labelClassName, success, err, children, ...rest} = props;
		return (
			<fieldset style={{marginBottom:noMargin?null:'15px'}} {...rest} className={className||''+ ' form-group' } className={err?'has-error':''}>
				{
					label&&<label className={labelClassName}>{label}</label>
				}
				{children}
				{
					success&&<small className="text-success">{success}</small>
				}
				{
					err&&<small className="text-danger">{err}</small>
				}
			</fieldset>
		);
	};

export default LabelFieldSet;
