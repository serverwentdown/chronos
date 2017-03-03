import React from 'react';

// eslint-disable-next-line react/prefer-stateless-function
export default class Container extends React.Component {
	render() {
		return (
			<div className="container">
				{ this.props.children }
			</div>
		);
	}
}

Container.propTypes = {
	children: React.PropTypes.node.isRequired,
};
