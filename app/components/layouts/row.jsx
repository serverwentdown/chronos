import React from 'react';

// eslint-disable-next-line react/prefer-stateless-function
export default class Row extends React.Component {
	render() {
		return (
			<div className="row">
				{ this.props.children }
			</div>
		);
	}
}

Row.propTypes = {
	children: React.PropTypes.node.isRequired,
};

