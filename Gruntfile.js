module.exports = function (grunt) {
	
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		webpack: {
			app: {
				entry: __dirname + '/app/index.jsx',
				output: {
					filename: 'bundle.js',
					path: __dirname + '/dist/app/'
				},
				resolve: {
					extensions: ['.js', '.jsx'],
				},
				module: {
					rules: [
						{
							test: /\.jsx?$/,
							exclude: /node_modules/,
							use: [
								{
									loader: 'babel-loader',
									options: {
										sourceMap: true,
										presets: ['env', 'react']
									}
								}
							]
						},
						{
							test: /\.css$/,
							use: [
								'style-loader',
								{
									loader: 'css-loader',
									options: {
										modules: true,
										importLoaders: 1
									}
								},
								{
									loader: 'postcss-loader',
									options: {
										plugins: {
											'postcss-import': {
												root: __dirname,
											},
											'postcss-mixins': {},
											'postcss-each': {},
											'postcss-cssnext': {}
										}
									}
								}
							]
						}
					]
				}
			}
		},
		copy: {
			app: {
				files: [
					{
						expand: true,
						cwd: __dirname + '/app/',
						src: ['index.html'],
						dest: __dirname + '/dist/app/'
					},
					{
						expand: true,
						cwd: __dirname + '/app/',
						src: ['assets/**'],
						dest: __dirname + '/dist/app/assets/'
					},
					{
						expand: true,
						cwd: __dirname + '/node_modules/oidc-client/',
						src: ['dist/**'],
						dest: __dirname + '/dist/app/assets/oidc-client/'
					}
				]
			}
		},
		babel: {
			options: {
				sourceMap: true,
				presets: [
					['env', {
						targets: {
							node: 'current'
						}
					}]
				]
			},
			server: {
				files: [
					{
						expand: true,
						cwd: __dirname + '/server/',
						src: ['**/*.js'],
						dest: __dirname + '/dist/server/'
					}
				]
			}
		},
		eslint: {
			app: {
				files: [
					{
						expand: true,
						cwd: __dirname + '/app/',
						src: ['**/*.js*'],
						dest: __dirname + '/dist/app/'
					}
				]
			},
			server: {
				files: [
					{
						expand: true,
						cwd: __dirname + '/server/',
						src: ['**/*.js'],
						dest: __dirname + '/dist/server/'
					}
				]
			}
		}
	});

	grunt.loadNpmTasks('grunt-webpack');
	grunt.loadNpmTasks('grunt-babel');
	grunt.loadNpmTasks('grunt-eslint');
	grunt.loadNpmTasks('grunt-contrib-copy');

	grunt.registerTask('all', ['eslint', 'webpack', 'copy', 'babel']);
	grunt.registerTask('default', ['all']);

};
