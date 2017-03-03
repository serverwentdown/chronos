import React from 'react';

import Container from '../components/layouts/container';
import Row from '../components/layouts/row';
import Column from '../components/layouts/column';

// eslint-disable-next-line react/prefer-stateless-function
export default class PageMain extends React.Component {
	render() {
		return (
			<Container>
				<Row>
					<Column width="3" breakpoint="lg">
						<h1>Hello, world! </h1>
					</Column>
					<Column>
						<h1>Hello, world! </h1>
					</Column>
				</Row>
			</Container>
		);
	}
}
