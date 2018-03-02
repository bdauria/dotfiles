export default {
	entry: './index.js',
	targets: [
		{format: 'cjs', dest: 'dist/output-profile.cjs.js'},
		{format: 'es',  dest: 'dist/output-profile.es.js'}
	]
};
