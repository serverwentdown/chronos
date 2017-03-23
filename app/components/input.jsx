import React from 'react';

// eslint-disable-next-line react/prefer-stateless-function
export default class Input extends React.Component {
	render() {
		return (
			<input
				type={this.props.type}
				placeholder={this.props.placeholder}
				className="form-control"
				value={this.props.value}
			/>
		);
	}
}

Input.propTypes = {
	type: React.PropTypes.string,
	placeholder: React.PropTypes.string,
	value: React.PropTypes.string,
};

Input.defaultProps = {
	type: 'text',
	placeholder: '',
	value: '',
};
