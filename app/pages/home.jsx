import React from 'react';

import { Card, CardTitle, CardText, CardActions, Button } from 'react-toolbox';
// import BigCalendar from 'react-big-calendar';
// import moment from 'moment';
// BigCalendar.setLocalizer(BigCalendar.momentLocalizer(moment));

import AddEventDialog from '../components/addeventdialog';

export default class PageHome extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			cards: [
				{ key: 0, title: 'Math Test', description: 'Meow' },
			],
			addEventDialogActive: false,
		};

		this.showAddEventDialog = this.showAddEventDialog.bind(this);
		this.hideAddEventDialog = this.hideAddEventDialog.bind(this);
	}

	showAddEventDialog() {
		this.setState({
			addEventDialogActive: true,
		});
	}

	hideAddEventDialog() {
		this.setState({
			addEventDialogActive: false,
		});
	}

	render() {
		return (
			<main>
				<div style={{ padding: '1em' }}>
					{this.state.cards.map(card =>
						<Card key={card.key} style={{ margin: '1em', width: 'auto' }}>
							<CardTitle title={card.title} />
							<CardText>{card.description}</CardText>
							<CardActions>
								<Button label="Edit" accent />
							</CardActions>
						</Card>,
					)}
				</div>
				<Button style={{ position: 'fixed', bottom: '1em', right: '1em' }} icon="add" floating accent onClick={this.showAddEventDialog} />
				<AddEventDialog
					active={this.state.addEventDialogActive}
					onCancel={this.hideAddEventDialog}
					onEscKeyDown={this.hideAddEventDialog}
					onOverlayClick={this.hideAddEventDialog}
				/>
			</main>
		);
	}
}
