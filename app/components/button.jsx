import React from 'react';

// eslint-disable-next-line react/prefer-stateless-function
export default class Button extends React.Component {
	render() {
		return (
			<button className={`btn btn-${this.props.color}`} onClick={this.props.onClick}>
				{ this.props.children }
			</button>
		);
	}
}

Button.propTypes = {
	children: React.PropTypes.node.isRequired,
	onClick: React.PropTypes.func,
	color: React.PropTypes.string,
};

Button.defaultProps = {
	onClick: () => {},
	color: 'primary',
};
