import React from 'react';

import { Tabs, Tab, Card, CardTitle, CardText, CardActions, Button } from 'react-toolbox';

import BigCalendar from 'react-big-calendar';
import moment from 'moment-timezone';
import '../calendar.css'; // Global styles

import AddEventDialog from '../components/addeventdialog';

BigCalendar.setLocalizer(BigCalendar.momentLocalizer(moment));

export default class PageHome extends React.Component {
	constructor(props, context) {
		super(props, context);
		this.state = {
			events: [],
			start: new Date(),
			end: new Date(Date.now() + (7 * 24 * 60 * 60 * 1000)),
			view: 0,
			addEventDialogActive: false,
			center: new Date(),
		};
		this.context = context;

		this.showAddEventDialog = this.showAddEventDialog.bind(this);
		this.hideAddEventDialog = this.hideAddEventDialog.bind(this);
		this.handleViewChange = this.handleViewChange.bind(this);
		this.handleNavigateEvent = this.handleNavigateEvent.bind(this);
		this.handleSelectEvent = this.handleSelectEvent.bind(this);
		this.paginateNext = this.paginateNext.bind(this);
		this.paginatePrev = this.paginatePrev.bind(this);

		this.fetchEvents(context); // TODO: split into three backend calls
	}

	componentDidMount() {
		this.context.tooling.setToolbar({
			showPagination: false,
			title: 'This Week\'s Agenda',
		});
		this.context.tooling.setPaginateNext(this.paginateNext);
		this.context.tooling.setPaginatePrev(this.paginatePrev);
	}
	componentWillUnmount() {
		this.context.tooling.setToolbar({
			showPagination: false,
		});
		this.context.tooling.setPaginateNext(() => {});
		this.context.tooling.setPaginatePrev(() => {});
	}

	async fetchEvents(context = this.context, start = this.state.start, end = this.state.end) {
		const query = `start=${start.getTime()}&end=${end.getTime()}`;
		return fetch(`/api/v1/schools/${context.user.school}/users/${context.user.id}/events?${query}`, {
			headers: {
				FakeAuth: true,
				FakeID: context.user.id,
			},
		})
		.then(data => data.json())
		.then((data) => {
			this.setState({
				events: data.map(e => Object.assign({}, e, {
					start: new Date(e.start),
					end: new Date(e.end),
				})),
			});
			console.log(`Fetched! ${data.length} events.`);
		})
		.catch((err) => {
			console.error(err);
		});
	}

	handleViewChange(value, center = this.state.center) {
		let start = center;
		let end = center;

		if (value === 0) {
			start = new Date();
			end = new Date(
				Date.now() + (7 * 24 * 60 * 60 * 1000),
			);
			this.context.tooling.setToolbar({
				showPagination: false,
				title: 'This Week\'s Agenda',
			});
		} else if (value === 1) {
			start = new Date(
				center.getFullYear(),
				center.getMonth(),
				center.getDate() - center.getDay(),
			);
			end = new Date(
				center.getFullYear(),
				center.getMonth(),
				(center.getDate() - center.getDay()) + 7,
			);
			this.context.tooling.setToolbar({
				showPagination: true,
				title: `${moment(start).format('Do MMM')} to ${moment(end).format('Do MMM Y')}`,
			});
		} else if (value === 2) {
			start = new Date(
				center.getFullYear(),
				center.getMonth() - 1,
				23,
			);
			end = new Date(
				center.getFullYear(),
				center.getMonth() + 1,
				6,
			);
			this.context.tooling.setToolbar({
				showPagination: true,
				title: moment(center).format('MMMM Y'),
			});
		}

		if (value !== this.state.value || center !== this.state.center) {
			console.log(`Will fetch... ${start} to ${end}`);
			this.fetchEvents(this.context, start, end);
		}

		this.setState({
			view: value,
			start,
			end,
			center,
		});
	}

	paginateNext() {
		if (this.state.view === 1) {
			this.handleNavigateEvent(new Date(this.state.center.getTime() + (7 * 24 * 60 * 60 * 1000)));
		} else if (this.state.view === 2) {
			this.handleNavigateEvent(new Date(
				this.state.center.getFullYear(),
				this.state.center.getMonth() + 1,
			));
		}
	}
	paginatePrev() {
		if (this.state.view === 1) {
			this.handleNavigateEvent(new Date(this.state.center.getTime() - (7 * 24 * 60 * 60 * 1000)));
		} else if (this.state.view === 2) {
			this.handleNavigateEvent(new Date(
				this.state.center.getFullYear(),
				this.state.center.getMonth() - 1,
			));
		}
	}

	handleNavigateEvent(date) {
		this.setState({
			center: date,
		});
		this.handleViewChange(this.state.view, date);
	}

	handleSelectEvent(event) {
		this.context.router.history.push(`/events/${event.id}`);
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
				<Tabs index={this.state.view} onChange={this.handleViewChange} inverse>
					<Tab label="Agenda">
						{this.state.events.map(event =>
							<Card key={`${event.id}@${event.start}`} style={{ margin: '1em', width: 'auto' }}>
								<CardTitle title={event.name} />
								<CardText>{`${moment(event.start).format('dddd, MMMM Do YYYY, HH:mm')} to ${moment(event.end).format('MMMM Do, HH:mm')}`}</CardText>
								<CardActions>
									<Button label="Edit" accent />
								</CardActions>
							</Card>,
						)}
					</Tab>
					<Tab label="Week">
						<div className="calendar">
							<BigCalendar
								view="week"
								toolbar={false}
								events={this.state.events}
								date={this.state.center}
								startAccessor="start"
								endAccessor="end"
								titleAccessor="name"
								onSelectEvent={this.handleSelectEvent}
								onNavigate={this.handleNavigateEvent}
							/>
						</div>
					</Tab>
					<Tab label="Month">
						<div className="calendar">
							<BigCalendar
								view="month"
								toolbar={false}
								events={this.state.events}
								date={this.state.center}
								startAccessor="start"
								endAccessor="end"
								titleAccessor="name"
								onSelectEvent={this.handleSelectEvent}
								onNavigate={this.handleNavigateEvent}
							/>
						</div>
					</Tab>
				</Tabs>
				<Button style={{ position: 'fixed', bottom: '1em', right: '1em' }} icon="add" floating accent onClick={this.showAddEventDialog} />
				<AddEventDialog
					active={this.state.addEventDialogActive}
					onCancel={this.hideAddEventDialog}
					onDone={this.fetchEvents}
					onEscKeyDown={this.hideAddEventDialog}
					onOverlayClick={this.hideAddEventDialog}
				/>
			</main>
		);
	}
}

PageHome.contextTypes = {
	router: React.PropTypes.shape({
		history: React.PropTypes.shape({
			push: React.PropTypes.func.isRequired,
		}).isRequired,
	}).isRequired,
	// eslint-disable-next-line react/forbid-prop-types
	user: React.PropTypes.object.isRequired,
	token: React.PropTypes.string,
	// eslint-disable-next-line react/forbid-prop-types
	tooling: React.PropTypes.object.isRequired,
};
