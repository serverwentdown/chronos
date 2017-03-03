import React from 'react';

// eslint-disable-next-line react/prefer-stateless-function
export default class Column extends React.Component {
	constructor() {
		super();
		this.className = this.className.bind(this);
	}

	className() {
		if (this.props.width) {
			if (this.props.breakpoint) {
				return `col-${this.props.breakpoint}-${this.props.width}`;
			}
			return `col-${this.props.width}`;
		}
		return 'col';
	}

	render() {
		return (
			<div className={this.className()}>
				{ this.props.children }
			</div>
		);
	}
}

Column.propTypes = {
	children: React.PropTypes.node.isRequired,
	width: React.PropTypes.number,
	breakpoint: React.PropTypes.string,
};

Column.defaultProps = {
	width: null,
	breakpoint: null,
};
