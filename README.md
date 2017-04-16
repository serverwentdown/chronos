
# Chronos

A school event planner and timetable

## Todo

- [x] Migrations
- [ ] Authentication
	- [x] Global React `user`
	- [x] OID auth client
	- [ ] jwt token provider
		- [x] auth is a choice between oidc and pass, sends token/pass to `/auth` for validation
		- [ ] `/auth` verifies oid token or pass, generates signed jwt
			- [ ] jwt taken contains user role
			- [ ] hide/protect certain element
		- [x] fake validator for jwt at protected endpoints
			- [ ] assume user is admin
	- [ ] Decide between email-validated OID or storing identity strictly
	- [ ] Additional email-based auth mechanism with tokens (like asciinema)
	- [ ] Redirect when not logged in
- [x] Create group
- [x] Create one-off events
	- [ ] Show event details
- [ ] Create attachments
	- [ ] Description
	- [ ] File
- [x] Create group CCAs
	- [x] Create CCA schedules
	- [ ] Differentiate CCAs from Mentor Groups
- [x] Create group mentor
	- [ ] Importable timetables
- [x] Display events as agenda
- [x] Display events as calendar
	- [ ] Drag one-time events around to modify
	- [ ] Hide weekly events in month view
- [ ] Show heatmap of the availability of the users in a group when creating an event
	- This is the event planning feature

- [ ] Create sample data
- [ ] Create admin interface in JavaFX (requirement)
	- [ ] Manage schools
	- [ ] Manage users in schools
	- [ ] Bulk create groups

- [ ] Refactor toolbar mutator for homepage pagination

## Security Pitfalls 

- Auth mechanism not verified
- Verification of OID tokens is done by upn being the email address
- Succeptable to insecure direct object references
