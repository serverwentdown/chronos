module.exports = {
	plugins: {
		'postcss-import': {
			root: __dirname,
		},
		'postcss-mixins': {},
		'postcss-each': {},
		'postcss-cssnext': {
			features: {
				customProperties: {
					variables: {
						'color-primary': 'var(--palette-purple-500)',
						'color-primary-dark': 'var(--palette-purple-700)',
						'color-accent': 'var(--palette-blue-a200)',
						'color-accent-dark': 'var(--palette-blue-700)',
					},
				},
			},
		},
	},
};
