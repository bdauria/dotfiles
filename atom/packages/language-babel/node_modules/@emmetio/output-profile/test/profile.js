'use strict';

const assert = require('assert');
require('babel-register');
const Profile = require('../index').default;

describe('Profile', () => {
	const attr = (name, value, options) => ({name, value, options: options || {}});

	it('tag name', () => {
		let profile = new Profile({tagCase: ''});
		assert.equal(profile.name('Foo'), 'Foo');
		assert.equal(profile.name('bAr'), 'bAr');

		profile = new Profile({tagCase: 'upper'});
		assert.equal(profile.name('Foo'), 'FOO');
		assert.equal(profile.name('bAr'), 'BAR');

		profile = new Profile({tagCase: 'lower'});
		assert.equal(profile.name('Foo'), 'foo');
		assert.equal(profile.name('bAr'), 'bar');
	});

	it('attribute name', () => {
		let profile = new Profile({attributeCase: ''});
		assert.equal(profile.attribute('Foo'), 'Foo');
		assert.equal(profile.attribute('bAr'), 'bAr');

		profile = new Profile({attributeCase: 'upper'});
		assert.equal(profile.attribute('Foo'), 'FOO');
		assert.equal(profile.attribute('bAr'), 'BAR');

		profile = new Profile({attributeCase: 'lower'});
		assert.equal(profile.attribute('Foo'), 'foo');
		assert.equal(profile.attribute('bAr'), 'bar');
	});

	it('self close', () => {
		let profile = new Profile({selfClosingStyle: 'html'});
		assert.equal(profile.selfClose(), '');

		profile = new Profile({selfClosingStyle: 'xhtml'});
		assert.equal(profile.selfClose(), ' /');

		profile = new Profile({selfClosingStyle: 'xml'});
		assert.equal(profile.selfClose(), '/');
	});

	it('indentation', () => {
		let profile = new Profile({indent: '\t'});
		assert.equal(profile.indent(), '');
		assert.equal(profile.indent(1), '\t');
		assert.equal(profile.indent(3), '\t\t\t');

		profile = new Profile({indent: '  '});
		assert.equal(profile.indent(), '');
		assert.equal(profile.indent(1), '  ');
		assert.equal(profile.indent(3), '      ');
	});

	it('inline elements', () => {
		let profile = new Profile();
		assert.equal(profile.isInline('a'), true);
		assert.equal(profile.isInline('b'), true);
		assert.equal(profile.isInline('c'), false);
	});
});
