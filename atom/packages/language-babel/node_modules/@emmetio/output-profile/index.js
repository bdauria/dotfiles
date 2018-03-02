'use strict';

import defaultOptions from './defaults';

/**
 * Creates output profile for given options (@see defaults)
 * @param {defaults} options
 */
export default class Profile {
    constructor(options) {
        this.options = Object.assign({}, defaultOptions, options);
        this.quoteChar = this.options.attributeQuotes === 'single' ? '\'' : '"';
    }

	/**
	 * Returns value of given option name
	 * @param {String} name
	 * @return {*}
	 */
	get(name) {
		return this.options[name];
	}

    /**
     * Quote given string according to profile
     * @param {String} str String to quote
     * @return {String}
     */
    quote(str) {
        return `${this.quoteChar}${str != null ? str : ''}${this.quoteChar}`;
    }

    /**
     * Output given tag name accoding to options
     * @param {String} name
     * @return {String}
     */
    name(name) {
        return strcase(name, this.options.tagCase);
    }

	/**
	 * Outputs attribute name accoding to current settings
	 * @param {String} Attribute name
	 * @return {String}
	 */
    attribute(attr) {
        return strcase(attr, this.options.attributeCase);
    }

    /**
     * Check if given attribute is boolean
     * @param {Attribute} attr
     * @return {Boolean}
     */
    isBooleanAttribute(attr) {
        return attr.options.boolean
			|| this.get('booleanAttributes').indexOf((attr.name || '').toLowerCase()) !== -1;
    }

	/**
	 * Returns a token for self-closing tag, depending on current options
	 * @return {String}
	 */
	selfClose() {
		switch (this.options.selfClosingStyle) {
			case 'xhtml': return ' /';
			case 'xml':   return '/';
			default:      return '';
		}
	}

	/**
	 * Returns indent for given level
	 * @param {Number} level Indentation level
	 * @return {String}
	 */
	indent(level) {
		level = level || 0;
		let output = '';
		while (level--) {
			output += this.options.indent;
		}

		return output;
	}

	/**
	 * Check if given tag name belongs to inline-level element
	 * @param {Node|String} node Parsed node or tag name
	 * @return {Boolean}
	 */
	isInline(node) {
        if (typeof node === 'string') {
            return this.get('inlineElements').indexOf(node.toLowerCase()) !== -1;
        }

        // inline node is a node either with inline-level name or text-only node
        return node.name != null ? this.isInline(node.name) : node.isTextOnly;
	}

	/**
	 * Outputs formatted field for given params
	 * @param {Number} index Field index
	 * @param {String} [placeholder] Field placeholder, can be empty
	 * @return {String}
	 */
	field(index, placeholder) {
		return this.options.field(index, placeholder);
	}
};

function strcase(string, type) {
    if (type) {
        string = type === 'upper' ? string.toUpperCase() : string.toLowerCase();
    }
    return string;
}
