
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
- [x] Create group
- [ ] Create one-off events
- [ ] Create attachments
	- [ ] Description
	- [ ] File
- [ ] Create group CCAs
	- [ ] Create CCA schedules
- [ ] Create group mentor
	- [ ] Importable timetables
- [ ] Display events as agenda
- [ ] Display events as calendar

- [ ] Create sample data

## Security Pitfalls 

- Auth mechanism not verified
- Verification of OID tokens is done by upn being the email address
- Succeptable to insecure direct object references
