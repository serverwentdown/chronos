module.exports = function (grunt) {
	
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		webpack: {
			app: {
				entry: './app/index.jsx',
				output: {
					filename: 'bundle.js',
					path: './dist/app/'
				},
				module: {
					loaders: [
						{
							test: /\.jsx?$/,
							exclude: /node_modules/,
							loader: 'babel-loader',
							query: {
								sourceMap: true,
								presets: ['env', 'react']
							}
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
						cwd: './app/',
						src: ['index.html'],
						dest: './dist/app/'
					},
					{
						expand: true,
						cwd: './app/',
						src: ['assets/**'],
						dest: './dist/app/assets/'
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
						cwd: './server/',
						src: ['*.js'],
						dest: './dist/server/'
					}
				]
			}
		},
		eslint: {
			app: ['./app/*.js*'],
			server: ['./server/*.js']
		}
	});

	grunt.loadNpmTasks('grunt-webpack');
	grunt.loadNpmTasks('grunt-babel');
	grunt.loadNpmTasks('grunt-eslint');
	grunt.loadNpmTasks('grunt-contrib-copy');

	grunt.registerTask('all', ['eslint', 'webpack', 'copy', 'babel']);
	grunt.registerTask('default', ['all']);

};
