import React from 'react';

import Container from '../components/layouts/container';
import Button from '../components/button';

// eslint-disable-next-line react/prefer-stateless-function
export default class PageLogin extends React.Component {
	render() {
		return (
			<Container>
				<Button>
					Login with Office365
				</Button>
			</Container>
		);
	}
}
