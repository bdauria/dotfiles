'use strict';

export default {
	/**
	 * String for one-level indentation
	 * @type {String}
	 */
	indent: '\t',

	/**
	 * Tag case: 'lower', 'upper' or '' (keep as-is)
	 * @type {String}
	 */
	tagCase: '',

	/**
	 * Attribute name case: 'lower', 'upper' or '' (keep as-is)
	 * @type {String}
	 */
	attributeCase: '',

	/**
	 * Attribute value quotes: 'single' or 'double'
	 * @type {String}
	 */
	attributeQuotes: 'double',

	/**
	 * Enable output formatting (indentation and line breaks)
	 * @type {Boolean}
	 */
	format: true,

	/**
	 * A list of tag names that should not get inner indentation
	 * @type {Set}
	 */
	formatSkip: ['html'],

	/**
	 * A list of tag names that should *always* get inner indentation.
	 * @type {Set}
	 */
	formatForce: ['body'],

	/**
	 * How many inline sibling elements should force line break for each tag.
	 * Set to 0 to output all inline elements without formatting.
	 * Set to 1 to output all inline elements with formatting (same as block-level).
	 * @type {Number}
	 */
	inlineBreak: 3,

	/**
	 * Produce compact notation of boolean attribues: attributes where name equals value.
	 * With this option enabled, output `<div contenteditable>` instead of
	 * `<div contenteditable="contenteditable">`
	 * @type {Boolean}
	 */
	compactBooleanAttributes: false,

	/**
	 * A set of boolean attributes
	 * @type {Set}
	 */
	booleanAttributes: ['contenteditable', 'seamless', 'async', 'autofocus',
		'autoplay', 'checked', 'controls', 'defer', 'disabled', 'formnovalidate',
		'hidden', 'ismap', 'loop', 'multiple', 'muted', 'novalidate', 'readonly',
		'required', 'reversed', 'selected', 'typemustmatch'],

	/**
	 * Style of self-closing tags:
	 * 'html'  – <br>
	 * 'xml'   – <br/>
	 * 'xhtml' – <br />
	 * @type {String}
	 */
	selfClosingStyle: 'html',

	/**
	 * A set of inline-level elements
	 * @type {Set}
	 */
	inlineElements: ['a', 'abbr', 'acronym', 'applet', 'b', 'basefont', 'bdo',
		'big', 'br', 'button', 'cite', 'code', 'del', 'dfn', 'em', 'font', 'i',
		'iframe', 'img', 'input', 'ins', 'kbd', 'label', 'map', 'object', 'q',
		's', 'samp', 'select', 'small', 'span', 'strike', 'strong', 'sub', 'sup',
		'textarea', 'tt', 'u', 'var']
};
