
# Chronos

A school event planner and timetable

## Todo

- [ ] Migrations, default data
- [ ] Authentication
	- [ ] Global React `user`
	- [x] OID auth client
	- [ ] jwt token provider
		- [ ] auth is a choice between oidc and pass, sends token/pass to `/auth` for validation
		- [ ] `/auth` verifies oid token or pass, generates signed jwt
			- [ ] jwt taken contains user role
			- [ ] hide/protect certain element
		- [ ] fake validator for jwt at protected endpoints
			- [ ] assume user is admin
- [ ] Create group
- [ ] Create one-off events
- [ ] Create attachments
	- [ ] Description
	- [ ] File
- [ ] Create group CCAs
- [ ] Create group mentor
- [ ] Display events as agenda
- [ ] Display events as calendar

- [ ] Create sample data

## Security Pitfalls 

- Auth mechanism not verified
- Succeptable to insecure direct object references
