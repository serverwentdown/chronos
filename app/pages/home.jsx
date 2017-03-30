import React from 'react';

import { Card, CardTitle, CardText, CardActions, Button } from 'react-toolbox';

// eslint-disable-next-line react/prefer-stateless-function
export default class PageHome extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			cards: [
				{ key: 0, title: 'Math Test', description: 'Meow' },
			],
		};
	}

	render() {
		return (
			<div style={{ padding: '1em' }}>
				{this.state.cards.map(card =>
					<Card key={card.key} style={{ margin: '1em', width: 'auto' }}>
						<CardTitle title={card.title} />
						<CardText>{card.description}</CardText>
						<CardActions>
							<Button label="Edit" />
						</CardActions>
					</Card>,
				)}
			</div>
		);
	}
}
