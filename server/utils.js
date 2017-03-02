const getVersion = () => {
	if (process.env.npm_package_version) {
		return process.env.npm_package_version;
	}
	throw new Error('Unable to obtain running version');
};

const fatal = (e) => {
	console.error(e);
	process.exit(1);
};

export { getVersion, fatal };
